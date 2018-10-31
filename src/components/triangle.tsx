import * as React from 'react';
import './elements.css';
import { ShapeProps } from './square';

export class Triangle extends React.Component<ShapeProps> {
    private elt = null;

    componentDidMount() {
        this.elt.addEventListener('mousedown', this.handleDragStart);
        this.elt.addEventListener('click', this.handleClick)
    }
    componentWillUnmount() {
        this.elt.removeEventListener('mousedown', this.handleDragStart);
        this.elt.removeEventListener('onclick', this.handleClick)
    }

    render() {
        const l = 2 * this.props.size * 1.73205080757 / 3;
        return (
            <div>
                {this.props.selected &&
                    <svg height={this.props.size * 2} width={this.props.size * 2}
                        style={{
                            position: "absolute", top: this.props.y - this.props.size / 2,
                            left: this.props.x - this.props.size / 2
                        }}
                        strokeDasharray="4 10">
                        <ellipse cx={this.props.size} cy={this.props.size} rx={this.props.size} ry={this.props.size} fill='none' stroke='white' />
                    </svg>
                }
                <svg height={this.props.size} width={l} style={{ position: "absolute", top: this.props.y, left: this.props.x }}>
                    <polygon points={createTrianglePoints(this.props.size, l)} style={{ fill: 'white', strokeWidth: 1 }} ref={r => this.elt = r} />
                </svg>
            </div>
        )
    }

    handleClick = () => {
        this.props.handleClick(this.props.id);
    }

    handleDragStart = e => {
        this.props.handleDragStart({ x: e.pageX - this.props.x, y: e.pageY - this.props.y }, this.props.id);
    }
}

const createTrianglePoints = (h: number, l: number) => {
    return `0,${h} ${l},${h} ${l / 2},0`
}