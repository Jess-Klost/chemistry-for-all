import { MolarMassExperiment, molarMassExperiment } from "./MolarMassExperiment.js";

// mL of gas released from the lighter, and mL of water displaced from the
// trough, in a single "Release Gas" action.
const RELEASE_VOLUME_ML = 40;

// Universal gas constant, L*atm / (mol*K).
const GAS_CONSTANT = 0.082057;

const TOTAL_STEPS = 5;

function createState() {
  return {
    index: 0,
    freshEntry: true,
    massBefore: null,
    massAfter: null,
    volumeCollected: null,
  };
}

let experiment = molarMassExperiment;
let state = createState();

function goToStep(index) {
  state.index = index;
  state.freshEntry = true;
  renderStep();
}

function renderStep() {
  const view = steps[state.index]();
  const wasFreshEntry = state.freshEntry;
  state.freshEntry = false;
  PageBuilder.render('app', Object.assign({}, view, {
    focusId: wasFreshEntry ? view.freshFocusId : view.actionFocusId,
  }));
}

function introStep() {
  return {
    status: 'Getting started',
    freshFocusId: 'stepHeading',
    html:
      '<h2 id="stepHeading" tabindex="-1">Welcome</h2>' +
      '<p>In this experiment you will find the molar mass of the gas inside a ' +
      'butane lighter using the vapor density method: weigh the lighter, release ' +
      'a measured volume of gas underwater to collect it, weigh the lighter again, ' +
      'and use the ideal gas law with the room’s temperature and pressure to ' +
      'calculate the molar mass.</p>' +
      '<h3>Equipment</h3>' +
      '<ul>' +
      '<li>Scale</li>' +
      '<li>Butane lighter</li>' +
      '<li>Sink</li>' +
      '<li>Water trough</li>' +
      '<li>Thermometer</li>' +
      '<li>Pressure sensor</li>' +
      '</ul>' +
      '<button type="button" id="startBtn">Start Experiment</button>',
    onMount: function (container) {
      container.querySelector('#startBtn').addEventListener('click', function () {
        goToStep(1);
      });
    },
  };
}

function weighBeforeStep() {
  const onScale = experiment.scale.objectsOnScale.includes(experiment.lighter);
  const mass = onScale ? experiment.scale.getCurrentMass() : null;

  let html =
    '<h2 id="stepHeading" tabindex="-1">Step 1 of ' + TOTAL_STEPS + ': Weigh the Lighter</h2>' +
    '<p>Place the lighter on the scale to record its starting mass.</p>' +
    '<button type="button" id="weighBtn"' + (onScale ? ' disabled' : '') + '>Place Lighter on Scale</button>';

  if (onScale) {
    html += '<p id="scaleReading" tabindex="-1">The scale reads <strong>' + mass.toFixed(4) + ' g</strong>.</p>';
    html += '<button type="button" id="recordBtn">Record Initial Mass and Continue</button>';
  }

  html += '<p><button type="button" id="backBtn">Back</button></p>';

  return {
    status: 'Step 1 of ' + TOTAL_STEPS,
    freshFocusId: 'stepHeading',
    actionFocusId: onScale ? 'scaleReading' : 'stepHeading',
    html: html,
    onMount: function (container) {
      const weighBtn = container.querySelector('#weighBtn');
      if (weighBtn) {
        weighBtn.addEventListener('click', function () {
          experiment.scale.addObjectToScale(experiment.lighter);
          renderStep();
        });
      }
      const recordBtn = container.querySelector('#recordBtn');
      if (recordBtn) {
        recordBtn.addEventListener('click', function () {
          state.massBefore = experiment.scale.getCurrentMass();
          experiment.scale.removeObjectFromScale(experiment.lighter);
          goToStep(2);
        });
      }
      container.querySelector('#backBtn').addEventListener('click', function () {
        goToStep(0);
      });
    },
  };
}

function prepareTroughStep() {
  const inSink = experiment.sink.objectsInSink.includes(experiment.trough);
  const isFull = experiment.trough.isFull();

  let html =
    '<h2 id="stepHeading" tabindex="-1">Step 2 of ' + TOTAL_STEPS + ': Prepare the Water Trough</h2>' +
    '<p>Add the trough to the sink, then turn on the faucet to fill it with water.</p>' +
    '<button type="button" id="addTroughBtn"' + (inSink ? ' disabled' : '') + '>Place Trough in Sink</button>';

  if (inSink) {
    html += ' <button type="button" id="faucetBtn">' + (experiment.sink.isOn ? 'Turn Off Faucet' : 'Turn On Faucet') + '</button>';
    html += '<p id="troughReading" tabindex="-1">The trough contains <strong>' + experiment.trough.currentLevel +
      ' mL</strong> of water (capacity ' + experiment.trough.capacity + ' mL).</p>';
  }

  if (isFull) {
    html += '<button type="button" id="continueBtn">Continue</button>';
  }

  html += '<p><button type="button" id="backBtn">Back</button></p>';

  let actionFocusId = 'stepHeading';
  if (inSink) actionFocusId = 'troughReading';

  return {
    status: 'Step 2 of ' + TOTAL_STEPS,
    freshFocusId: 'stepHeading',
    actionFocusId: actionFocusId,
    html: html,
    onMount: function (container) {
      const addTroughBtn = container.querySelector('#addTroughBtn');
      if (addTroughBtn) {
        addTroughBtn.addEventListener('click', function () {
          experiment.sink.addObjectToSink(experiment.trough);
          renderStep();
        });
      }
      const faucetBtn = container.querySelector('#faucetBtn');
      if (faucetBtn) {
        faucetBtn.addEventListener('click', function () {
          if (experiment.sink.isOn) {
            experiment.sink.turnOffSink();
          } else {
            experiment.sink.turnOnSink();
          }
          renderStep();
        });
      }
      const continueBtn = container.querySelector('#continueBtn');
      if (continueBtn) {
        continueBtn.addEventListener('click', function () {
          goToStep(3);
        });
      }
      container.querySelector('#backBtn').addEventListener('click', function () {
        goToStep(1);
      });
    },
  };
}

function collectGasStep() {
  const released = state.volumeCollected !== null;

  let html =
    '<h2 id="stepHeading" tabindex="-1">Step 3 of ' + TOTAL_STEPS + ': Collect the Gas</h2>' +
    '<p>Release butane gas from the lighter underwater in the trough. The escaping ' +
    'gas pushes an equal volume of water out of the trough, so the drop in the ' +
    'trough’s water level tells you the volume of gas collected.</p>';

  if (!released) {
    html += '<button type="button" id="releaseBtn">Release Gas</button>';
  } else {
    html += '<p id="collectResult" tabindex="-1">Released and collected <strong>' + state.volumeCollected +
      ' mL</strong> of gas. The trough now contains ' + experiment.trough.currentLevel + ' mL of water.</p>';
    html += '<button type="button" id="continueBtn">Continue</button>';
  }

  html += '<p><button type="button" id="backBtn">Back</button></p>';

  return {
    status: 'Step 3 of ' + TOTAL_STEPS,
    freshFocusId: 'stepHeading',
    actionFocusId: released ? 'collectResult' : 'stepHeading',
    html: html,
    onMount: function (container) {
      const releaseBtn = container.querySelector('#releaseBtn');
      if (releaseBtn) {
        releaseBtn.addEventListener('click', function () {
          const volume = Math.min(RELEASE_VOLUME_ML, experiment.lighter.mlOfButane, experiment.trough.currentLevel);
          experiment.lighter.mlOfButane -= volume;
          experiment.trough.currentLevel -= volume;
          state.volumeCollected = volume;
          renderStep();
        });
      }
      const continueBtn = container.querySelector('#continueBtn');
      if (continueBtn) {
        continueBtn.addEventListener('click', function () {
          goToStep(4);
        });
      }
      container.querySelector('#backBtn').addEventListener('click', function () {
        goToStep(2);
      });
    },
  };
}

function weighAfterStep() {
  const onScale = experiment.scale.objectsOnScale.includes(experiment.lighter);
  const mass = onScale ? experiment.scale.getCurrentMass() : null;

  let html =
    '<h2 id="stepHeading" tabindex="-1">Step 4 of ' + TOTAL_STEPS + ': Weigh the Lighter Again</h2>' +
    '<p>Place the lighter back on the scale to record its mass after releasing gas.</p>' +
    '<button type="button" id="weighBtn"' + (onScale ? ' disabled' : '') + '>Place Lighter on Scale</button>';

  if (onScale) {
    html += '<p id="scaleReading" tabindex="-1">The scale reads <strong>' + mass.toFixed(4) + ' g</strong>.</p>';
    html += '<button type="button" id="recordBtn">Record Final Mass and Continue</button>';
  }

  html += '<p><button type="button" id="backBtn">Back</button></p>';

  return {
    status: 'Step 4 of ' + TOTAL_STEPS,
    freshFocusId: 'stepHeading',
    actionFocusId: onScale ? 'scaleReading' : 'stepHeading',
    html: html,
    onMount: function (container) {
      const weighBtn = container.querySelector('#weighBtn');
      if (weighBtn) {
        weighBtn.addEventListener('click', function () {
          experiment.scale.addObjectToScale(experiment.lighter);
          renderStep();
        });
      }
      const recordBtn = container.querySelector('#recordBtn');
      if (recordBtn) {
        recordBtn.addEventListener('click', function () {
          state.massAfter = experiment.scale.getCurrentMass();
          experiment.scale.removeObjectFromScale(experiment.lighter);
          goToStep(5);
        });
      }
      container.querySelector('#backBtn').addEventListener('click', function () {
        goToStep(3);
      });
    },
  };
}

function roomConditionsStep() {
  const html =
    '<h2 id="stepHeading" tabindex="-1">Step 5 of ' + TOTAL_STEPS + ': Record Room Conditions</h2>' +
    '<p>The thermometer and pressure sensor report the current ambient conditions, ' +
    'which the ideal gas law calculation needs.</p>' +
    '<ul>' +
    '<li>Temperature: ' + experiment.thermometer.temperature + ' °C</li>' +
    '<li>Pressure: ' + experiment.pressureSensor.pressure + ' torr</li>' +
    '</ul>' +
    '<button type="button" id="continueBtn">Continue to Results</button>' +
    '<p><button type="button" id="backBtn">Back</button></p>';

  return {
    status: 'Step 5 of ' + TOTAL_STEPS,
    freshFocusId: 'stepHeading',
    actionFocusId: 'stepHeading',
    html: html,
    onMount: function (container) {
      container.querySelector('#continueBtn').addEventListener('click', function () {
        goToStep(6);
      });
      container.querySelector('#backBtn').addEventListener('click', function () {
        goToStep(4);
      });
    },
  };
}

function resultsStep() {
  const massLost = state.massBefore - state.massAfter;
  const volumeL = state.volumeCollected / 1000;
  const temperatureK = experiment.thermometer.temperature + 273.15;
  const pressureAtm = experiment.pressureSensor.pressure / 760;
  const moles = (pressureAtm * volumeL) / (GAS_CONSTANT * temperatureK);
  const molarMass = massLost / moles;

  const html =
    '<h2 id="stepHeading" tabindex="-1">Results</h2>' +
    '<p>Using the ideal gas law (PV = nRT) with your measurements:</p>' +
    '<ul>' +
    '<li>Mass lost by the lighter: ' + massLost.toFixed(4) + ' g</li>' +
    '<li>Volume of gas collected: ' + state.volumeCollected + ' mL</li>' +
    '<li>Temperature: ' + temperatureK.toFixed(2) + ' K</li>' +
    '<li>Pressure: ' + pressureAtm.toFixed(4) + ' atm</li>' +
    '<li>Moles of gas: ' + moles.toFixed(6) + ' mol</li>' +
    '</ul>' +
    '<p>Calculated molar mass: <strong>' + molarMass.toFixed(2) + ' g/mol</strong></p>' +
    '<button type="button" id="restartBtn">Restart Experiment</button>';

  return {
    status: 'Results',
    freshFocusId: 'stepHeading',
    actionFocusId: 'stepHeading',
    html: html,
    onMount: function (container) {
      container.querySelector('#restartBtn').addEventListener('click', function () {
        experiment = new MolarMassExperiment();
        state = createState();
        renderStep();
      });
    },
  };
}

const steps = [
  introStep,
  weighBeforeStep,
  prepareTroughStep,
  collectGasStep,
  weighAfterStep,
  roomConditionsStep,
  resultsStep,
];

export function initExperiment() {
  PageBuilder.init({ statusRegionId: 'status' });
  renderStep();
}
