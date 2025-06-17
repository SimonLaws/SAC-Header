(function () {
  const script = document.createElement('script');
  script.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
  script.onload = () => console.log("html2canvas loaded successfully");
  document.head.appendChild(script);

  let template = document.createElement("template");
  template.innerHTML = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap');

      :host {
        display: block;
      }

      :host .headerContainer {
        display: flex;
        background-color: #FFFFFF;
        align-items: center;
        height: 99px;
        padding: 0 16px;
      }

      :host .headerTitles {
        flex: 1 0 auto;
        row-gap: 0px;
      }

      :host .headerIcons {
        display: flex;
        column-gap: 24px;
      }

      :host .dashTitle {
        font-family: "Montserrat", sans-serif;
        font-weight: 400;
        margin: 0;
        font-size: 2rem;
        color: #00313c;
        line-height: 1.25;
      }

      :host .dashSubTitle {
        font-size: 0.9375rem;
        color: #707070;
        font-family: var(--sapFontFamily);
        font-weight: 400;
        line-height: 1.5;
      }

      :host .headerHelpBtn,
      :host .headerFeedbackBtn {
        display: flex;
        align-items: center;
        flex-direction: column;
        cursor: pointer;
        padding: 0;
        row-gap: 4px;
        border-bottom: 2px solid transparent; 
      }

      :host .helpText,
      :host .feedbackText {
        font-size: 0.9375rem;
        font-weight: 600;
        color: #215A72;
        font-family: var(--sapFontFamily);
        line-height: 22.5px;
      }

      :host .headerHelpBtn:hover,
      :host .headerFeedbackBtn:hover {
        border-bottom: 2px solid #215A72;
        cursor: pointer;
      }
    </style>

    <div class="headerContainer">
      <div class="headerTitles">
        <div class="dashTitle" id="dash-title"></div>
        <div class="dashSubTitle" id="dash-subtitle"></div>
      </div>
      <div class="headerIcons">
        <div class="headerHelpBtn" id="help-button" type="button">
          <div class="helpIcon">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2LjAwMDEgMi42NjY2OUM4LjYzMDc2IDIuNjY2NjkgMi42NjY3NSA4LjYzMDAyIDIuNjY2NzUgMTZDMi42NjY3NSAyMy4zNjkyIDguNjMwMDggMjkuMzMzNCAxNi4wMDAxIDI5LjMzMzRDMjMuMzY5NCAyOS4zMzM0IDI5LjMzMzQgMjMuMzcgMjkuMzMzNCAxNkMyOS4zMzM0IDguNjMwNyAyMy4zNzAxIDIuNjY2NjkgMTYuMDAwMSAyLjY2NjY5Wk0xNi4wMDAxIDI3LjQ3MjlDOS42NzM5NCAyNy40NzI5IDQuNTI3MjIgMjIuMzI2MiA0LjUyNzIyIDE2QzQuNTI3MjIgOS42NzM4MiA5LjY3Mzk0IDQuNTI3MTYgMTYuMDAwMSA0LjUyNzE2QzIyLjMyNjMgNC41MjcxNiAyNy40NzI5IDkuNjczODIgMjcuNDcyOSAxNkMyNy40NzI5IDIyLjMyNjIgMjIuMzI2MyAyNy40NzI5IDE2LjAwMDEgMjcuNDcyOVoiIGZpbGw9IiMyMzc5OUUiLz4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTIiIGZpbGw9IiMyMzc5OUUiLz4KPHBhdGggZD0iTTE1LjU5MDQgMjAuNzA5QzE0Ljc3MDggMjAuNzA5IDE0LjEwNzQgMjEuMzkxOSAxNC4xMDc0IDIyLjIxMTRDMTQuMTA3NCAyMy4wMTE0IDE0Ljc1MTMgMjMuNzEzOSAxNS41OTA0IDIzLjcxMzlDMTYuNDI5NCAyMy43MTM5IDE3LjA5MjggMjMuMDExNCAxNy4wOTI4IDIyLjIxMTRDMTcuMDkyOCAyMS4zOTE5IDE2LjQwOTggMjAuNzA5IDE1LjU5MDQgMjAuNzA5WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTE1Ljg0MzkgOS4zMzMzN0MxMy4yMDk3IDkuMzMzMzcgMTIgMTAuODk0NCAxMiAxMS45NDgxQzEyIDEyLjcwOSAxMi42NDM5IDEzLjA2MDMgMTMuMTcwNyAxMy4wNjAzQzE0LjIyNDQgMTMuMDYwMyAxMy43OTUyIDExLjU1NzggMTUuNzg1NCAxMS41NTc4QzE2Ljc2MSAxMS41NTc4IDE3LjU0MTUgMTEuOTg3MSAxNy41NDE1IDEyLjg4NDdDMTcuNTQxNSAxMy45MzgzIDE2LjQ0ODggMTQuNTQzMiAxNS44MDQ5IDE1LjA4OTVDMTUuMjM5IDE1LjU3NzIgMTQuNDk3NiAxNi4zNzczIDE0LjQ5NzYgMTguMDU1NEMxNC40OTc2IDE5LjA3IDE0Ljc3MDggMTkuMzYyNyAxNS41NzA4IDE5LjM2MjdDMTYuNTI2OCAxOS4zNjI3IDE2LjcyMiAxOC45MzM1IDE2LjcyMiAxOC41NjI2QzE2LjcyMiAxNy41NDggMTYuNzQxNSAxNi45NjI3IDE3LjgxNDcgMTYuMTIzNkMxOC4zNDE1IDE1LjcxMzkgMjAgMTQuMzg3IDIwIDEyLjU1MjlDMjAgMTAuNzE4NyAxOC4zNDE1IDkuMzMzMzcgMTUuODQzOSA5LjMzMzM3WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg=="/>
          </div>
          <div class="helpText">Help</div>
        </div>        
        <div class="headerFeedbackBtn" id="feedback-button" type="button">
          <div class="feedbackIcon">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUgNy44NzU1NEM1IDUuMjM0NTMgNi45MzYwMyA0Ljg3Nzg0IDcuOTA0MDQgNS4wMjk2M0gyNS41NjA3QzI3LjA0NzYgNS4wMjk2MyAyNy44MDY0IDYuNjIzMyAyOCA3LjQyMDE0VjE5LjM3M0MyOCAyMS45MjI5IDI2LjA2NCAyMi4zMzI3IDI1LjA5NiAyMi4yMTg5SDkuODc4NzlMNSAyN1Y3Ljg3NTU0WiIgZmlsbD0iIzIzNzk5RSIgc3Ryb2tlPSIjMjM3OTlFIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTEgMTFIMjIiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xMSAxNUgxOCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==" alt="Feedback Icon" />
          </div>
          <div class="feedbackText">Feedback</div>
        </div>
      </div>
    </div>
  `;

  class dashTitle extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this._titleContainer = this._shadowRoot.getElementById("dash-title");
      this._subtitleContainer = this._shadowRoot.getElementById("dash-subtitle");
      this._helpLink = null; // Will be set via update from SAC at runtime
      this._showCollectorDialog = null;
      this._feedbackLink = null; // Will be set via update from SAC
      this._collectorID = null; // Will be set at run time
      this._shadowRoot.getElementById("help-button").addEventListener("click", () => {
        if (this._helpLink) {
          window.open(this._helpLink, "_blank");
        } else {
          console.warn("Help link not defined.");
        }
      });
    }

    _updateDashTitle(value) {
      this._titleContainer.textContent = value || "Title"; // fallback
    }

    _updateDashSubtitle(value) {
      this._subtitleContainer.textContent = value || "Subtitle"; // fallback
    }
    
    _updateHelpLink(value) {
      this._helpLink = value || "https://www.csiro.au"; // fallback link
    }

    _updatefeedbackLink (value) {
      this._feedbackLink = value;
    }

    _updatecollectorID (value) {
      this._collectorID = value;
    }


    onCustomWidgetBeforeUpdate(changedProperties) {
      if ("title" in changedProperties) {
        this._updateDashTitle(changedProperties.title);
      }
      if ("subtitle" in changedProperties) {
        this._updateDashSubtitle(changedProperties.subtitle);
      }
      if ("helpLink" in changedProperties) {
        this._updateHelpLink(changedProperties.helpLink);
      }
      if ("feedbackLink" in changedProperties) {
        this._updatefeedbackLink(changedProperties.feedbackLink)
      }
      if ("collectorID" in changedProperties) {
        this._updatecollectorID(changedProperties.collectorID)
      }
    }

    onCustomWidgetAfterUpdate(changedProperties) {
      if ("title" in changedProperties) {
        this._updateDashTitle(changedProperties.title);
      }
      if ("subtitle" in changedProperties) {
        this._updateDashSubtitle(changedProperties.subtitle);
      }
      if ("helpLink" in changedProperties) {
        this._updateHelpLink(changedProperties.helpLink);
      }
      if ("feedbackLink" in changedProperties) {
        this._updatefeedbackLink(changedProperties.feedbackLink)
      }
      if ("collectorID" in changedProperties) {
        this._updatecollectorID(changedProperties.collectorID)
      }
    }

    //The below two blocks of code are used to convert the widget to an image at export time.
    serializeCustomWidgetToImage = async () => {
      return new Promise((resolve, reject) => {
        if (typeof html2canvas !== "function") {
          reject("html2canvas is not loaded");
          return;
      }

    html2canvas(this._shadowRoot.host, {
      backgroundColor: null,
      scale: 2
    }).then(canvas => {
      const imageStr = canvas.toDataURL("image/png"); // <-- Base64 PNG
      resolve(imageStr); // <-- returned to SAC
      }).catch(error => {
      reject("Image capture failed: " + error);
        });
      });
    };
    
    //The below code is used to create the Jira Issue collector box that pops up when the feedback button is clicked
    connectedCallback() {
      const collectorUrl = "https://jira-sd.csiro.au/plugins/servlet/issueCollectorBootstrap.js?collectorId=57d7f85e&locale=en_AU";

      const button = this.shadowRoot.getElementById("feedback-button");

      // 1. Set up the custom trigger function BEFORE script loads
      window.ATL_JQ_PAGE_PROPS = {
        fieldValues: {
          summary: "Default issue summary",
          description: "Describe the issue here.\n\nSteps to reproduce:\n1. ...\n2. ...",
          customfield_10000: "Example value"  // Replace with your actual custom field ID
        },
        triggerFunction: (showCollectorDialog) => {
          this._showCollectorDialog = showCollectorDialog;
        }
      };

      // 2. Button click from shadow DOM triggers collector manually
      button.addEventListener("click", (e) => {
        e.preventDefault();
        if (this._showCollectorDialog) {
          this._showCollectorDialog();
        } else {
          console.warn("Jira collector not ready yet.");
        }
      });

      // 3. Inject Jira collector script
      if (!document.querySelector(`script[src="${collectorUrl}"]`)) {
        const script = document.createElement("script");
        script.src = collectorUrl;
        script.type = "text/javascript";
        script.async = true;
        document.head.appendChild(script);
      }
    }
  }
customElements.define("com-csiro-title", dashTitle);
})();
