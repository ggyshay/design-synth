import * as React from 'react';
import './elements.css'

export interface SliderProps {
    min: number;
    max: number;
    value?: number;
    onChange?: (v: number) => void;
    vertical?: boolean;
}

export class Slider extends React.Component<SliderProps, any>{
    constructor(props) {
        super(props);
        this.state = {
            value: props.min,
        }
    }
    render() {
        return (
            <div>
                <input type="range" min={this.props.min} max={this.props.max} value={this.props.value || this.state.value}
                    className="slider" onChange={this.handleChange} style={{transform: this.props.vertical ? 'rotate(90deg) translateX(4rem)' : ''}}/>
            </div>
        )
    }

    handleChange = e => {
        this.setState({ value: e.target.value });
        if (this.props.onChange) this.props.onChange(e.target.value);
    }
}