import * as React from 'react';
import './elements.css';
import { ShapeProps } from './square';

export class Circle extends React.Component<ShapeProps> {
    private elt = null;

    componentDidMount() { this.elt.addEventListener('mousedown', this.handleDragStart) }
    componentWillUnmount() { this.elt.addEventListener('mousedown', this.handleDragStart) }

    render() {
        return (
            <svg height={2 * this.props.size} width={2 * this.props.size} style={{ position: "absolute", top: this.props.y, left: this.props.x }}>
                <ellipse rx={this.props.size} ry={this.props.size} cx={this.props.size} cy={this.props.size} style={{ fill: 'white' }} ref={r => this.elt = r} />
            </svg>
        )
    }

    handleDragStart = e => {
        this.props.handleDragStart({ x: e.pageX - this.props.x, y: e.pageY - this.props.y }, this.props.id);
    }
}