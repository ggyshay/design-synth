import * as React from 'react';
import { BackgroundMenu, Circle, Square, Triangle, AudioEngine } from './components';
import './App.css'
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';
import { shape } from 'prop-types';

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
    bgValues: { 0?: number, 1?: number, 2?: number },
    selectedId: string;
}

export class Canvas extends React.Component<any, CanvasState> {
    private engine: AudioEngine;

    constructor(props) {
        super(props);
        this.engine = new AudioEngine();
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
            bgValues: { 0: 0, 1: 0, 2: 0 },
            selectedId: ''
        }
    }

    componentDidMount() {
        this.engine.setup();
    }
    render() {
        return (
            <div onMouseUp={this.handleMouseUp} id='canvas' style={{ backgroundImage: this.bgGradient }}>
                <Square size={160} handleDragStart={this.handleDragStart} id={Shapes.square}
                    x={this.state.square.x} y={this.state.square.y} selected={this.state.selectedId === Shapes.square}
                    handleClick={this.selectShape} />
                <Triangle size={160} handleDragStart={this.handleDragStart} id={Shapes.triangle}
                    x={this.state.triangle.x} y={this.state.triangle.y} selected={this.state.selectedId === Shapes.triangle}
                    handleClick={this.selectShape} />
                <Circle size={80} handleDragStart={this.handleDragStart} id={Shapes.circle}
                    x={this.state.circle.x} y={this.state.circle.y} selected={this.state.selectedId === Shapes.circle}
                    handleClick={this.selectShape} />
                <BackgroundMenu handleParamChange={this.handleBackgroundChanges} />
            </div>
        )
    }

    get bgGradient() {
        return `linear-gradient(to bottom right, hsl(${this.state.bgValues[0] || 0}, 100%, ${this.state.bgValues[2] || 0}%), hsl(${this.state.bgValues[1] || 0}, 100%, ${this.state.bgValues[2] || 0}%))`
    }

    handleBackgroundChanges = (id: string, value: number) => {
        switch (id) {
            case '0':
                this.setState(state => { return { bgValues: { ...state.bgValues, 0: value } } });
                this.engine.changeParam('detune', Math.abs(this.state.bgValues[1] - value) / 360);
                break;
            case '1':
                this.setState(state => { return { bgValues: { ...state.bgValues, 1: value } } });
                this.engine.changeParam('detune', Math.abs(value - this.state.bgValues[0]) / 360);
                break;
            case '2':
                this.setState(state => { return { bgValues: { ...state.bgValues, 2: value } } });
                this.engine.changeParam('baseFrequency', value * 10);
                break;
        }
    }

    selectShape = (id: string) => {
        if (this.state.selectedId === id) {
            this.setState({ selectedId: '' })
        } else {
            this.setState({ selectedId: id });
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
                this.engine.changeParam('cutoffFrequency', (e.pageX - x) * 18000 / window.innerWidth)
                this.engine.changeParam('fltQ', (e.pageY - y) * 20 / window.innerHeight)
                break;
            case Shapes.triangle:
                this.setState({ triangle: { x: e.pageX - x, y: e.pageY - y } });
                this.engine.changeParam('noiseGain', (e.pageX - x) * 4 / window.innerWidth)
                break;
            case Shapes.circle:
                this.setState({ circle: { x: e.pageX - x, y: e.pageY - y } });
                this.engine.changeParam('reverbWet', (e.pageX - x) / window.innerWidth)
                this.engine.changeParam('distortion', Math.abs(e.pageY - y) / window.innerHeight)
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