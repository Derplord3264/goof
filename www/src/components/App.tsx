import * as React from "react";
import { Message } from "../models/Message";
import { randColor } from "../palette";

export interface AppProps {
    conn: WebSocket
}

export interface AppState {
    input: string
    messages: Message[]
}

export class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props)
        this.props.conn.onmessage = this.onMessage.bind(this)
        this.onMessage.bind(this)
        this.onChange.bind(this)
        this.onSubmit.bind(this)

        this.state = {
            input: "",
            messages: [],
        }
    }

    onMessage(e: MessageEvent) {
        console.log(e.data)
        const m = new Message().fromJSON(e.data)
        this.setState({
            input: this.state.input,
            messages: this.state.messages.concat([m])
        })
    }

    onChange(e: React.FormEvent) {
        const input: string = (e.target as any).value;

        this.setState({ 
            input: input,
            messages: this.state.messages,
        })
    }

    onSubmit(e: React.FormEvent) {
        e.preventDefault()

        const m = new Message()
        m.body = this.state.input

        this.props.conn.send(m.toString())

        this.setState({
            input: "",
            messages: this.state.messages,
        })
    }

    render() {
        return (
            <div>
                <ul className="chat-messages">
                    { 
                        this.state.messages.map(function(m, i) { 
                            const nameStyle = {
                                color: m.color
                            }
                            return <li key={i}><span style={nameStyle}>{m.name}</span> {m.body}</li>
                        }) 
                    }
                </ul>

                <form className="chat-input" onSubmit={ e => this.onSubmit(e) }>
                    <input type="text" value={ this.state.input } onChange={ e => this.onChange(e) } autoComplete="off" id="msg" size="64"/>
                    <input type="submit" value="Send" />
                </form>
            </div>
        )
    }
}
