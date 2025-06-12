(function () {
  let template = document.createElement("template");
  template.innerHTML = `
    <style>
      :host {
        font-size: .875rem;
        color: #999;
        line-height: 24px;
        vertical-align: middle;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-bottom: 4px;
      }
      :host select, :host input {
        width: 100%;
        direction: inherit;
        text-align: left;
        font-family: var(--sapFontFamily);
        font-size: var(--sapFontSize);
        color: var(--sapField_TextColor);
        text-overflow: ellipsis;
        background-color: var(--sapField_Background);
        border: 1px solid var(--sapField_BorderColor);
        padding: 3.25px 20px 3.25px 8px;
        box-sizing: border-box;
      }
      :host label {
        display: block;
        max-height: 500px;
        overflow-y: auto;
      }
    </style>
    <div class="customStyleItem">
      <label for="dashTitle">Title Text</label>
      <input type="text" id="dash-title" placeholder="Dashboard Title"><br><br>
    </div>
    <div class="customStyleItem">
      <label for="dashSubtitle">Subtitle Text</label>
      <input type="text" id="dash-subtitle" placeholder="Dashboard Subtitle"><br><br>
    </div>
    <div class="customStyleItem">
      <label for="helpLink">Help Link</label>
      <input type="text" id="help-link" placeholder="Link to help documentation."><br><br>
    </div>
    <div class="customStyleItem">
      <label for="feedbackLink">Feedback Link</label>
      <input type="text" id="feedback-link" placeholder="Example: https://jira-sd.csiro.au/servicedesk"><br><br>
    </div>
    <div class="customStyleItem">
      <label for="collectorID">Jira Issue Collector ID</label>
      <input type="text" id="collector-ID" placeholder="The collector ID granted by Jira SD"><br><br>
    </div>
  `;

  class dashTitleStylingPanel extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));

      this._titleText = this._shadowRoot.getElementById("dash-title");
      this._subtitleText = this._shadowRoot.getElementById("dash-subtitle");
      this._feedbackLink = this._shadowRoot.getElementById("feedback-link");
      this._helpLink = this._shadowRoot.getElementById("help-link");
      this._collectorID = this._shadowRoot.getElementById("collector-ID")

      this._titleText.addEventListener("input", this._submit.bind(this));
      this._subtitleText.addEventListener("input", this._submit.bind(this));
      this._feedbackLink.addEventListener("input", this._submit.bind(this));
      this._helpLink.addEventListener("input", this._submit.bind(this));
      this._collectorID.addEventListener("input", this._submit.bind(this));
    }

    _submit(e) {
      e.preventDefault();
      const properties = {
        title: this._titleText.value,
        subtitle: this._subtitleText.value,
        feedbackLink: this._feedbackLink.value,
        helpLink: this._helpLink.value,
        collectorID: this._collectorID.value
      };

      this.dispatchEvent(new CustomEvent("propertiesChanged", {
        detail: { properties }
      }));
    }

    set title(newTitle) {
      this._titleText.value = newTitle;
    }

    set subtitle(newSubtitle) {
      this._subtitleText.value = newSubtitle;
    }

    set feedbackLink(newFeedbackLink) {
      this._feedbackLink.value = newFeedbackLink;
    }

    set helpLink(newHelpLink) {
      this._helpLink.value = newHelpLink;
    }

    set collectorID(newCollectorID) {
      this._collectorID = newCollectorID;
    }
  }

  customElements.define("com-csiro-title-styling", dashTitleStylingPanel);
})();
