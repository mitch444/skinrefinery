(function () {
  var heroVideo = document.getElementById("hero-video");

  if (!heroVideo) {
    return;
  }

  function setSlowPlayback() {
    heroVideo.defaultPlaybackRate = 0.5;
    heroVideo.playbackRate = 0.5;
  }

  heroVideo.addEventListener("loadedmetadata", setSlowPlayback);
  heroVideo.addEventListener("play", setSlowPlayback);
  setSlowPlayback();
})();

(function () {
  var groups = document.querySelectorAll("[data-choice-group]");

  if (!groups.length) {
    return;
  }

  groups.forEach(function (group) {
    var options = group.querySelectorAll(".cro-option");

    function updateSelectionStyles() {
      options.forEach(function (option) {
        var input = option.querySelector("input");
        if (!input) {
          return;
        }

        option.classList.toggle("is-selected", input.checked);
      });
    }

    group.addEventListener("change", updateSelectionStyles);
    updateSelectionStyles();
  });
})();

(function () {
  var timeSlots = document.querySelectorAll(".cro-time-slot");

  if (!timeSlots.length) {
    return;
  }

  function setSelectedSlot(selectedSlot) {
    timeSlots.forEach(function (slot) {
      var isSelected = slot === selectedSlot;
      slot.classList.toggle("is-selected", isSelected);
      slot.setAttribute("aria-pressed", isSelected ? "true" : "false");
    });
  }

  timeSlots.forEach(function (slot) {
    slot.addEventListener("click", function () {
      setSelectedSlot(slot);
    });
  });
})();

(function () {
  var steps = document.querySelectorAll(".cro-funnel-step[data-step]");
  var progressItems = document.querySelectorAll(".cro-progress li[data-step]");

  if (!steps.length || !progressItems.length) {
    return;
  }

  function setActiveStep(activeStepNumber) {
    steps.forEach(function (step) {
      var stepNumber = Number(step.getAttribute("data-step"));
      step.classList.toggle("is-active-step", stepNumber === activeStepNumber);
    });

    progressItems.forEach(function (item) {
      var stepNumber = Number(item.getAttribute("data-step"));
      item.classList.toggle("is-active", stepNumber === activeStepNumber);
      item.classList.toggle("is-complete", stepNumber < activeStepNumber);
    });
  }

  steps.forEach(function (step) {
    var stepNumber = Number(step.getAttribute("data-step"));

    function activateCurrentStep() {
      setActiveStep(stepNumber);
    }

    step.addEventListener("click", activateCurrentStep);
    step.addEventListener("focusin", activateCurrentStep);
  });

  setActiveStep(1);
})();
