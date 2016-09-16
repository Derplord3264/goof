package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/nu7hatch/gouuid"
)

// The map containing all active rooms
var rooms = make(map[string]*Hub)
var userCounts = make(map[string]int)
var addr = flag.String("addr", ":8080", "http service address")

func newRoomHandler(w http.ResponseWriter, r *http.Request) {
	log.Println(r.Method, r.URL)
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", 405)
		return
	}

	// make a new room with a random ID and store it in the map of rooms
	key, err := uuid.NewV4()
	if err != nil {
		log.Fatal(err)
	}

	// create a hub for the new room
	hub := newHub()
	rooms[key.String()] = hub
	go hub.run()

	// redirect to the new room's url
	http.Redirect(w, r, "/room/"+key.String(), 302)

	return
}

func roomHandler(w http.ResponseWriter, r *http.Request) {
	log.Println(r.Method, r.URL)

	// look up the room by id
	key := mux.Vars(r)["key"]

	// Check if the room exits
	if rooms[key] != nil {
		http.ServeFile(w, r, "./www/chat.html")
	}

	// No room
	http.NotFound(w, r)
}

func serveWs(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	defer conn.Close()

	// look up the room by id
	key := mux.Vars(r)["key"]
	hub := rooms[key]
	count := userCounts[key]

	if hub != nil {
		// TODO: nick registration and client colors
		// this should probably be handled automatically when you register a client
		name := "GOOF " + fmt.Sprintf("%d", count)
		userCounts[key] = count + 1

		client := &Client{
			name:  name,
			color: randColor(),
			hub:   hub,
			conn:  conn,
			send:  make(chan []byte, 256),
		}

		hub.register <- client
		go client.writePump()
		client.readPump()
	} else {
		http.NotFound(w, r)
	}
}

func main() {
	flag.Parse()

	// Routing
	r := mux.NewRouter()

	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		log.Println(r.Method, r.URL)
		http.ServeFile(w, r, "./www/index.html")
	})

	// Serve static files
	r.PathPrefix("/dist/").Handler(http.FileServer(http.Dir("www/")))

	// App
	r.HandleFunc("/room", newRoomHandler)
	r.HandleFunc("/room/{key}", roomHandler)

	// Websockets
	r.HandleFunc("/ws/{key}", serveWs)

	srv := &http.Server{
		Handler:      r,
		Addr:         "127.0.0.1" + string(*addr),
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	err := srv.ListenAndServe()
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
