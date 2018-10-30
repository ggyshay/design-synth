import * as React from 'react';
import './elements.css'
import { Slider } from './slider';

export interface BackgroundMenuProps {
    handleParamChange: (id: string, value: number) => void;
}

export class BackgroundMenu extends React.Component<BackgroundMenuProps> {
    render() {
        return (
            <div className='background-menu-container'>
                <div>
                    <Slider min={0} max={360} vertical onChange={value => this.props.handleParamChange('0', value)} />
                </div>
                <div>
                    <Slider min={0} max={360} vertical onChange={value => this.props.handleParamChange('1', value)}/>
                </div>
                <div>
                    <Slider min={0} max={100} vertical onChange={value => this.props.handleParamChange('2', value)}/>
                </div>
            </div>
        )
    }
}