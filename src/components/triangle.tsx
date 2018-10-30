import * as React from 'react';
import './elements.css';
import { ShapeProps } from './square';

export class Triangle extends React.Component<ShapeProps> {
    private elt = null;

    componentDidMount() { this.elt.addEventListener('mousedown', this.handleDragStart) }
    componentWillUnmount() { this.elt.addEventListener('mousedown', this.handleDragStart) }

    render() {
        const l = 2 * this.props.size * 1.73205080757 / 3;
        return (
            <svg height={this.props.size} width={l} style={{ position: "absolute", top: this.props.y, left: this.props.x }}>
                <polygon points={createTrianglePoints(this.props.size, l)} style={{ fill: 'white', strokeWidth: 1 }} ref={r => this.elt = r} />
            </svg>
        )
    }

    handleDragStart = e => {
        this.props.handleDragStart({ x: e.pageX - this.props.x, y: e.pageY - this.props.y }, this.props.id);
    }
}

const createTrianglePoints = (h: number, l: number) => {
    return `0,${h} ${l},${h} ${l / 2},0`
}