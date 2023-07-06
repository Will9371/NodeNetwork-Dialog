class ModeSelector 
{
    constructor() 
    {
        this.radioButtons = document.querySelectorAll('input[name="mode"]');
        this.init();
    }

    init() 
    {
        this.radioButtons.forEach((radio) => 
            { radio.addEventListener("change", (e) => 
                { this.onModeChange(e.target.value); }); });

        document.addEventListener("keydown", (e) => 
        {
            switch(e.key.toLowerCase())
            {
                case 'z': this.onModeChange("move"); break;
                case 'x': this.onModeChange("add_delete"); break;
                case 'c': this.onModeChange("connect"); break;
                case 'v': this.onModeChange("view"); break;
                default: break;
            }
        });
    }

    onModeChange(mode) 
    {
        const event = new CustomEvent("modeChange", { detail: { mode } });
        document.dispatchEvent(event);
    }
}

export { ModeSelector };
