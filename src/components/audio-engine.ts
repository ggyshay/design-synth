import Reverb from 'soundbank-reverb';

export class AudioEngine {
    private ctx: AudioContext;
    private osc1: OscillatorNode;
    private osc2: OscillatorNode;
    private osc3: OscillatorNode;
    private osc4: OscillatorNode;
    private lfo1: OscillatorNode;
    private lfo1G: GainNode;
    private lfo2G: GainNode;
    private lfo2: OscillatorNode;
    private flt: BiquadFilterNode;
    private noiseG: GainNode;
    private filterLfo: OscillatorNode;
    private filterLfoG: GainNode;
    private reverb: Reverb;
    private distortion: WaveShaperNode;

    private params = {
        baseFrequency: 167,
        detune: 1,
        cutoffFrequency: 500,
        lfo1Rate: 0.1,
        lfo2Rate: 0.04,
        noiseGain: 0.3,
        fltQ: 0.5,
        reverbWet: 0.1,
        distortion: 10
    }


    private noise: AudioBufferSourceNode;

    constructor() {
        this.ctx = new AudioContext();
    }


    setup = () => {
        this.osc1 = new OscillatorNode(this.ctx);
        this.osc2 = new OscillatorNode(this.ctx);
        this.osc3 = new OscillatorNode(this.ctx);
        this.osc4 = new OscillatorNode(this.ctx);
        this.lfo1 = new OscillatorNode(this.ctx);
        this.lfo2 = new OscillatorNode(this.ctx);
        this.filterLfo = new OscillatorNode(this.ctx);
        this.filterLfoG = new GainNode(this.ctx);
        this.flt = new BiquadFilterNode(this.ctx);
        this.lfo1G = new GainNode(this.ctx);
        this.lfo2G = new GainNode(this.ctx);
        this.noiseG = new GainNode(this.ctx);
        this.setupAudioBufferNode();
        this.reverb = Reverb(this.ctx);
        this.distortion = new WaveShaperNode(this.ctx);


        this.setValues();

        this.lfo1.connect(this.lfo1G);
        this.lfo2.connect(this.lfo2G);
        this.lfo1G.connect(this.osc1.frequency);
        this.lfo2G.connect(this.osc2.frequency);
        this.osc1.connect(this.flt);
        this.osc2.connect(this.flt);
        this.osc3.connect(this.flt);
        this.osc4.connect(this.flt);
        this.filterLfo.connect(this.filterLfoG);
        this.filterLfoG.connect(this.flt.frequency);
        this.noise.connect(this.noiseG);
        this.noiseG.connect(this.flt);
        this.flt.connect(this.distortion);
        this.distortion.connect(this.reverb);
        this.reverb.connect(this.ctx.destination);

        this.start();
    }

    setValues = () => {
        this.osc1.frequency.value = this.params.baseFrequency;
        this.osc1.type = 'square';
        this.osc2.type = 'square';
        this.osc3.type = 'square';
        this.osc4.type = 'square';
        const detunes = this.calculateDetunes();
        this.osc2.frequency.value = this.params.baseFrequency * detunes[0];
        this.osc3.frequency.value = this.params.baseFrequency * detunes[1];
        this.osc4.frequency.value = this.params.baseFrequency * detunes[2];
        this.flt.frequency.value = this.params.cutoffFrequency;
        this.lfo1.frequency.value = this.params.lfo1Rate;
        this.lfo2.frequency.value = this.params.lfo2Rate;
        this.lfo1G.gain.value = this.params.baseFrequency / 25;
        this.lfo2G.gain.value = this.params.baseFrequency * this.params.detune / 27;
        this.noiseG.gain.value = this.params.noiseGain;
        this.filterLfo.frequency.value = 0.2;
        this.filterLfoG.gain.value = this.params.cutoffFrequency / 5;
        this.flt.Q.value = this.params.fltQ;
        this.distortion.curve = this.makeDistortionCurve(this.params.distortion);

        this.reverb.wet.value = this.params.reverbWet;
        this.reverb.dry.value = 1 - this.params.reverbWet;
    }

    setupAudioBufferNode = () => {
        const arrayBuffer = this.ctx.createBuffer(2, this.ctx.sampleRate * 3, this.ctx.sampleRate);
        for (var channel = 0; channel < arrayBuffer.numberOfChannels; channel++) {
            var nowBuffering = arrayBuffer.getChannelData(channel);
            for (var i = 0; i < arrayBuffer.length; i++) {
                nowBuffering[i] = Math.random() * 2 - 1;
            }
        }
        this.noise = new AudioBufferSourceNode(this.ctx);
        this.noise.buffer = arrayBuffer;
        this.noise.loop = true;
    }

    start = () => {
        const now = this.ctx.currentTime + 0.1;
        this.osc1.start(now);
        this.osc2.start(now);
        this.lfo1.start(now);
        this.lfo2.start(now);
        this.osc3.start(now);
        this.osc4.start(now);
        this.noise.start(now);
        this.filterLfo.start(now);
    }

    calculateDetunes = () => {
        const x = this.params.detune;
        const x2 = x * x;
        const x3 = x2 * x;

        //calculated to take interval [0, 0.75] and map it to Dom, Maj, Min, halfdim chords
        return {
            0: 5 / 4 + 7 / 30 * x - 6 / 5 * x2 + 16 / 15 * x3,
            1: 3 / 2 - 4 / 27 * x + 8 / 9 * x2 - 32 / 27 * x3,
            2: 16 / 9 + 7 / 6 * x - 35 / 9 * x2 + 28 / 9 * x3
        }
    }

    changeParam = (param: string, value: number | string) => {
        if (this.params[param] !== null) {
            console.log(param, value);
            this.params[param] = value;
            this.setValues();
        } else {
            throw `Param ${param} does not exist`
        }
    }
    makeDistortionCurve(amount) {
        var k = typeof amount === 'number' ? amount : 50,
            n_samples = 44100,
            curve = new Float32Array(n_samples),
            deg = Math.PI / 180,
            i = 0,
            x;
        for (; i < n_samples; ++i) {
            x = i * 2 / n_samples - 1;
            curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
        }
        return curve;
    };
}
