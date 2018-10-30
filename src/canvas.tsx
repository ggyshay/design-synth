import * as React from 'react';
import { BackgroundMenu, Circle, Square, Triangle } from './components';
import './App.css'

export interface CanvasState {
    square: {
        x: number,
        y: number
    },
    triangle: {
        x: number, y: number
    },
    circle: {
        x: number, y: number,
    },
    draggingPoint: { x: number, y: number },
    draggingId: string,
    bgValues: { 1?: number, 2?: number, 3?: number }
}

export class Canvas extends React.Component<any, CanvasState> {
    constructor(props) {
        super(props);

        this.state = {
            square: {
                x: 20,
                y: 100
            },
            triangle: {
                x: 100, y: 300
            },
            circle: {
                x: 300, y: 300,
            },
            draggingPoint: { x: null, y: null },
            draggingId: null,
            bgValues: { 1: null, 2: null, 3: null }
        }
    }
    render() {
        return (
            <div onMouseUp={this.handleMouseUp} id='canvas' style={{ backgroundImage: this.bgGradient }}>
                <Square size={160} handleDragStart={this.handleDragStart} id={Shapes.square} x={this.state.square.x} y={this.state.square.y} />
                <Triangle size={160} handleDragStart={this.handleDragStart} id={Shapes.triangle} x={this.state.triangle.x} y={this.state.triangle.y} />
                <Circle size={80} handleDragStart={this.handleDragStart} id={Shapes.circle} x={this.state.circle.x} y={this.state.circle.y} />
                <BackgroundMenu handleParamChange={this.handleBackgroundChanges} />
            </div>
        )
    }

    get bgGradient() {
        const j = `linear-gradient(to bottom right, hsl(${this.state.bgValues[0] || 0}, 100%, ${this.state.bgValues[2] || 0}%), hsl(${this.state.bgValues[1] || 0}, 100%, ${this.state.bgValues[2] || 0}%))`
        // const j = `linear-gradient(235.78deg, rgba(${this.state.bgValues[0] || 0}, 100, ${this.state.bgValues[2] || 0}) 11.66%, rgba(255, 255, 255, 0) 97.68%), rgba(${this.state.bgValues[1] || 0}, 100, ${this.state.bgValues[2] || 0})`
        console.log(j);
        return j
    }

    handleBackgroundChanges = (id: string, value: number) => {
        switch (id) {
            case '0':
                this.setState(state => { return { bgValues: { ...state.bgValues, 0: value } } });
                break;
            case '1':
                this.setState(state => { return { bgValues: { ...state.bgValues, 1: value } } });
                break;
            case '2':
                this.setState(state => { return { bgValues: { ...state.bgValues, 2: value } } });
                break;
        }
    }

    handleDragStart = (e: MouseEvent, id: string) => {
        document.addEventListener('mousemove', this.onMouseMove);
        this.setState({ draggingPoint: { x: e.x, y: e.y }, draggingId: id });
    }

    onMouseMove = (e: MouseEvent) => {
        const { x, y } = this.state.draggingPoint;
        switch (this.state.draggingId) {
            case Shapes.square:
                this.setState({ square: { x: e.pageX - x, y: e.pageY - y } });
                break;
            case Shapes.triangle:
                this.setState({ triangle: { x: e.pageX - x, y: e.pageY - y } });
                break;
            case Shapes.circle:
                this.setState({ circle: { x: e.pageX - x, y: e.pageY - y } });
                break;
        }
    }

    handleMouseUp = () => {
        document.removeEventListener('mousemove', this.onMouseMove);
        this.setState({ draggingPoint: null, draggingId: null });
    }
}

export enum Shapes {
    square = 'square',
    triangle = 'triangle',
    circle = 'circle'
}