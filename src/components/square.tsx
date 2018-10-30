import * as React from 'react';
import './elements.css';

export class Square extends React.Component<ShapeProps> {
    render() {
        return (
            <div onMouseDown={e => this.handleDragStart(e)} className='square-component'
                style={{
                    width: this.props.size, height: this.props.size,
                    position: "absolute", top: this.props.y, left: this.props.x
                }} />
        )
    }

    handleDragStart = e => {
        this.props.handleDragStart({ x: e.pageX - this.props.x, y: e.pageY - this.props.y }, this.props.id)
    }
}

export interface ShapeProps {
    x: number,
    y: number,
    size: number,
    id: string
    handleDragStart: (e: any, id: string) => void
}