import * as React from 'react';
import './elements.css';

export class Square extends React.Component<ShapeProps> {
    render() {
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

                <div onMouseDown={e => this.handleDragStart(e)} className='square-component'
                    style={{
                        width: this.props.size, height: this.props.size,
                        position: "absolute", top: this.props.y, left: this.props.x
                    }}
                    onClick={e => this.props.handleClick(this.props.id)}
                />
            </div>
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
    selected?: boolean
    handleDragStart: (e: any, id: string) => void;
    handleClick: (id: string) => void;
}