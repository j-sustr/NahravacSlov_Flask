
class AudioPlayer
{
    constructor(ctx, onended)
    {
        this.ctx = ctx;
        this.onended = onended;
    }

    play(buffer, sampleRate)
    {
        const newArrayBuffer = this.ctx.createBuffer(1, buffer.length, sampleRate);
        newArrayBuffer.copyToChannel(buffer, 0);

        const source = this.ctx.createBufferSource();
        source.onended = this.onended;

        source.connect(this.ctx.destination);
        source.buffer = newArrayBuffer;
        source.start();
    }
}

