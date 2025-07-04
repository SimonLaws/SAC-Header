(function () {
  // Dynamically load the html2canvas library so the widget can export itself as a PNG
  const script = document.createElement('script');
  script.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
  // Log a check to ensure html2canvas has loaded
  script.onload = () => console.log("html2canvas loaded successfully");
  document.head.appendChild(script);

  // Define the template for the custom element
  let template = document.createElement("template");
  template.innerHTML = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');
      
      :host {
        display: block;
      }

      :host .headerContainer {
        display: flex;
        background-color: #FFFFFF;
        align-items: center;
        height: 96px;
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
        font-family: "Open Sans";
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
        font-family: "Open Sans";
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
      <div class="headerIcons" data-html2canvas-ignore="true">
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
  
  // Define the custom SAC widget class
  class dashTitle extends HTMLElement {
    constructor() {
      super();
      // Create shadow DOM and attach the template content
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));

      // Cache references to important elements in the shadow DOM
      this._titleContainer = this._shadowRoot.getElementById("dash-title");
      this._subtitleContainer = this._shadowRoot.getElementById("dash-subtitle");
      this._helpButton = this._shadowRoot.getElementById("help-button");
      this._feedbackButton = this._shadowRoot.getElementById("feedback-button");
      
      // Initialise configuration properties
      this._helpLink = null; // Will be set at run time
      this._feedbackLink = null; // Will be set at run time
      this._collectorID = null; // Will be set at run time
      this._sdCollectorID = null; // Will be set at run time
      this._showCollectorDialog = null;
      
      // Add click listener for the help button to open the help link
      this._shadowRoot.getElementById("help-button").addEventListener("click", () => {
        if (this._helpLink) {
          window.open(this._helpLink, "_blank");
        } else {
          console.warn("Help link not defined.");
        }
      });
      // Retrieve and log user email from the SAC session
      this._userEmail = FPA_SESSION.userParams.EMAIL;
      console.log(this._userEmail);

      // Collect system information for issue reporting
      this._systemInfo =  `Page Title: ${sap.fpa.ui.infra.service.firefly.FireflyServiceManagerBase._storyModel.oData.analytic.title}\n` +
                          `Story URL: ${location.href}\n` +
                          `User Agent: ${navigator.userAgent}\n` +
                          `Viewport: ${window.innerWidth} × ${window.innerHeight}`;
      console.log(this._systemInfo);

      // Collect the name of the user from the session
      this._userName = FPA_SESSION.userParams.DISPLAY_NAME;
    }
    
    // Helper Functions

    // Helper to update title text
    _updateDashTitle(value) {
      this._titleContainer.textContent = value;
    }

    // Helper to update subtitle text
    _updateDashSubtitle(value) {
      this._subtitleContainer.textContent = value;
    }
    
    // Helper to update Help Link url
    _updateHelpLink(value) {
      this._helpLink = value;
    }

    // Helper to update feedback link url
    _updatefeedbackLink (value) {
      this._feedbackLink = value;
    }
    
    // Set Jira collector ID and load the collector script dynamically
    _updatecollectorID(value) {
      // Store the provided collector ID in this instance
      this._collectorID = value;

      // If no value is provided, stop processing
      if (!value) return;

      // Construct the full URL for the Jira Issue Collector script
      const collectorUrl = `https://jira.csiro.au/plugins/servlet/issueCollectorBootstrap.js?collectorId=${value}&locale=en_AU`;

      // Define the ATL_JQ_PAGE_PROPS global object
      // This object must exist before the collector script loads.
      // It configures the form fields and the trigger function the collector will call.
      window.ATL_JQ_PAGE_PROPS = {
        fieldValues: {
          // Default values to prefill in the Jira form
          summary: "Default issue summary",
          description: "Describe the issue here.\n\nSteps to reproduce:\n1. ...\n2. ...",
          name: this._userName,
          email: this._userEmail,          // The user's email from SAC session
          environment: this._systemInfo    // System details to help with troubleshooting
        },
        // The collector script will call this function when it's ready
        // We save the provided showCollectorDialog function so we can invoke it later
        triggerFunction: (showCollectorDialog) => {
          this._showCollectorDialog = showCollectorDialog;
        }
      };

      // Check if the Jira collector script has already been added to the page
      // Avoids duplicating the script and reloading it unnecessarily
      if (!document.querySelector(`script[src="${collectorUrl}"]`)) {
        // Dynamically create the script element
        const script = document.createElement("script");
        script.src = collectorUrl;
        script.type = "text/javascript";
        script.async = true;

        // Add the script to the page header so it starts loading
        document.head.appendChild(script);
      }
    }

    // Set Jira collector ID and load the collector script dynamically
    _updateSDCollectorID(value) {
      // Store the provided collector ID in this instance
      this._sdCollectorID = value;
      
      // If no value is provided, stop processing
      if (!value) return

      // Construct the full URL for the Jira Issue Collector script
      const sdCollectorUrl = `https://jira-sd.csiro.au/plugins/servlet/issueCollectorBootstrap.js?collectorId=${value}&locale=en_AU`;
      
      // Define the ATL_JQ_PAGE_PROPS global object
      // This object must exist before the collector script loads.
      // It configures the form fields and the trigger function the collector will call.
      window.ATL_JQ_PAGE_PROPS = {
        fieldValues: {
          summary: "Default issue summary",
          description: "Describe the issue here.\n\nSteps to reproduce:\n1. ...\n2. ...",
          email: this._userEmail,
          name: this._userName,
          environment: this._systemInfo     
        },
        // The collector script will call this function when it's ready
        // We save the provided showCollectorDialog function so we can invoke it later
        triggerFunction: (showCollectorDialog) => {
          this._showCollectorDialog = showCollectorDialog;
        }
      };

      // Check if the Jira collector script has already been added to the page
      // Avoids duplicating the script and reloading it unnecessarily
      if (!document.querySelector(`script[src="${sdCollectorUrl}"]`)) {
        // Dynamically create the script element
        const script = document.createElement("script");
        script.src = sdCollectorUrl;
        script.type = "text/javascript";
        script.async = true;
        // Add the script to the page header so it starts loading
        document.head.appendChild(script);
      }
    }

    // Show or hide the help button depending on configuration at design time
    _toggleHelpButton() {
      if (this._helpLink && this._helpLink.trim() !== "") {
        this._helpButton.style.display = "flex"; 
      } else {
        this._helpButton.style.display = "none";
      }
    }

    // Show or hide the feedback button depending on configuration at design time
    _toggleFeedbackButton() {
      if (
        (this._feedbackLink && this._feedbackLink.trim() !== "") ||
        (this._collectorID && this._collectorID.trim() !== "") ||
        (this._sdCollectorID && this._sdCollectorID.trim() !== "")
      ) {
      this._feedbackButton.style.display = "flex";
      } else {
        this._feedbackButton.style.display = "none";
      }
    }

    // Standard SAC custom widget lifecycle method: handles property updates
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
        this._updatefeedbackLink(changedProperties.feedbackLink);
      }
      if ("collectorID" in changedProperties) {
        this._updatecollectorID(changedProperties.collectorID);
      }
      if ("sdCollectorID" in changedProperties) {
        this._updateSDCollectorID(changedProperties.sdCollectorID)
      }
      this._toggleHelpButton();
      this._toggleFeedbackButton();
    }
/*
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
        this._updatefeedbackLink(changedProperties.feedbackLink);
      }
      if ("collectorID" in changedProperties) {
        this._updatecollectorID(changedProperties.collectorID);
      }
      if ("sdCollectorID" in changedProperties) {
        this._updateSDCollectorID(changedProperties.sdCollectorID)
      }
      this._toggleHelpButton();
      this._toggleFeedbackButton();
    }
*/
    
    // Utility: Export the entire widget (shadow DOM and all) as a PNG image
    // This is called by SAC when the user exports the story or wants an image snapshot
    serializeCustomWidgetToImage = async () => {
      return new Promise((resolve, reject) => {
        // Check that the html2canvas library has been loaded
        // If it's missing, reject the promise so SAC knows it failed
        if (typeof html2canvas !== "function") {
          reject("html2canvas is not loaded");
          return;
      }

    // Use html2canvas to render the custom element's shadow host to a canvas
    // this._shadowRoot.host refers to the top-level custom element itself
    html2canvas(this._shadowRoot.host, {
      backgroundColor: null,  // Set to null for transparent background in PNG
      scale: 2                // Increase scale for higher-resolution export
    }).then(canvas => {
      // html2canvas has successfully rendered the widget to a <canvas> element
      // Convert the canvas to a Base64-encoded PNG image string
      const imageStr = canvas.toDataURL("image/png"); // <-- Base64 PNG
      // Resolve the promise, returning the image string to SAC
      resolve(imageStr);
      }).catch(error => {
        // If html2canvas fails (e.g., rendering error or security restriction)
        // Reject the promise with an error message
        reject("Image capture failed: " + error);
        });
      });
    };
    
    // Lifecycle method called automatically when the custom element is added to the DOM
    // Used here to attach a click event listener to the feedback button  
    connectedCallback() {
      // Get a reference to the feedback button inside the shadow DOM
      const button = this.shadowRoot.getElementById("feedback-button");
      // Add a click event listener to the feedback button
      button.addEventListener("click", (e) => {
        // Prevent default click behavior (just in case it's a <button> or <a>)
        e.preventDefault();
      
      // === First priority: if a direct feedback link is set ===
      // If the user has configured a feedback URL (like an external form or page),
      // open it in a new browser tab immediately
      if (this._feedbackLink) {
        console.log("Opening feedback link:", this._feedbackLink);
        window.open(this._feedbackLink, "_blank");
      return; // Stop here; don't check other options
      }

      // === Second priority: Jira Project Issue collector ===
      // If a Jira collector ID is set, try to show the issue collector dialog
      if (this._collectorID) {
        if (this._showCollectorDialog) {
          // The collector script is loaded and the dialog is ready
          console.log("Opening Jira collector dialog");
          this._showCollectorDialog();
        } else {
            // The collector ID is set, but the script might not have finished loading yet
            console.warn("Collector ID is set but showCollectorDialog not ready yet");
          }
      return; // Stop here; don't check further  
      }
      // === Third priority: Jira Service Desk collector ===
      // Similar to the above but for a different collector 
      if (this._sdCollectorID) {
        if (this._showCollectorDialog) {
          // The SD collector script is loaded and ready
          console.log("Opening Jira collector dialog");
          this._showCollectorDialog();
        } else {
            // The SD collector ID is set, but the dialog function isn't ready yet
            console.warn("Collector ID is set but showCollectorDialog not ready yet");
          }
      return;      
      }
      // If no link or collector ID is configured at all,
      console.warn("No feedback link or collector ID set.");
      });
    };
  };
  // Register the custom element
  customElements.define("com-csiro-title", dashTitle);
})();
