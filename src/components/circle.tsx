import * as React from 'react';
import './elements.css';
import { ShapeProps } from './square';

export class Circle extends React.Component<ShapeProps> {
    private elt = null;

    componentDidMount() {
        this.elt.addEventListener('mousedown', this.handleDragStart);
        this.elt.addEventListener('click', this.handleClick)
    }
    componentWillUnmount() {
        this.elt.removeEvenListener('mousedown', this.handleDragStart);
        this.elt.removeEvenListener('click', this.handleClick)
    }

    render() {
        return (
            <div>
                {this.props.selected &&
                    <svg height={this.props.size * 4} width={this.props.size * 4}
                    style={{ position: "absolute", top: this.props.y - this.props.size, left: this.props.x - this.props.size}}
                    strokeDasharray="4 10">
                        <ellipse cx={this.props.size * 2} cy={this.props.size*2} rx={this.props.size*2} ry={this.props.size*2} fill='none' stroke='white' />
                    </svg>
                }
                <svg height={2 * this.props.size} width={2 * this.props.size} style={{ position: "absolute", top: this.props.y, left: this.props.x }}>
                    <ellipse rx={this.props.size} ry={this.props.size} cx={this.props.size} cy={this.props.size} style={{ fill: 'white' }} ref={r => this.elt = r} />
                </svg>
            </div>
        )
    }

    handleClick = () => {
        this.props.handleClick(this.props.id)
    }

    handleDragStart = e => {
        this.props.handleDragStart({ x: e.pageX - this.props.x, y: e.pageY - this.props.y }, this.props.id);
    }
}