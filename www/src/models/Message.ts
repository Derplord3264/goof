export interface MessageSerialized {
    Name: string;
    Body: string;
    Color: string;
}

export class Message {
    name: string
    body: string
    color: string

    toString(): string {
        return this.body
    }

    fromJSON(json: string): Message {
        console.log(json)
        const m = <MessageSerialized> JSON.parse(json)
        this.name = m.Name
        this.body = m.Body
        this.color = m.Color
        return this
    }
    
}