import m from "mithril";

function getXY(event, canvas) {
  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;
  return [x, y];
}

function clusterAttempt(displayElement, trial, onComplete, onSingleCluster) {
  const stimulus = trial.stimulus;

  const canvas = document.createElement("canvas");
  canvas.setAttribute("width", 800);
  canvas.setAttribute("height", 500);
  canvas.classList.add("clustering-canvas"); // for border
  displayElement.innerHTML = ""; // clear whatever was in there
  displayElement.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  // Visual display state
  const clusterPaths = [];
  let currentlyDrawing = false;
  let currentClusterPath = new Path2D();

  // Event listener state
  let removeAllEventListeners = null; // will be set after listeners are created.

  // Data state
  const clustersData = [];
  let currentClusterPointsData = [];

  // Data
  const metadata = {
    startDateTime: Date.now(),
    startTimestamp: performance.now(),
    endTimestamp: null
  };

  function addClusterPoint(x, y) {
    currentClusterPointsData.push({
      x,
      y,
      timestamp: performance.now()
    });
  }

  function finishClusterPoint(x, y) {
    addClusterPoint(x, y);
    clustersData.push(currentClusterPointsData);
    currentClusterPointsData = [];
  }

  function recolorPoints() {
    for (const { x, y } of stimulus.points) {
      for (const path of clusterPaths) {
        if (ctx.isPointInPath(path, x, y)) {
          ctx.save();
          ctx.fillStyle = "#0000FF";
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    }
  }

  function completeTrial(data) {
    removeAllEventListeners();
    onComplete(data);
  }

  function completeSingleClusterTrial() {
    removeAllEventListeners();
    onSingleCluster();
  }

  function completionCheck() {
    const everyPointInSomePath = stimulus.points.every(({ x, y }) => {
      return clusterPaths.some(path => ctx.isPointInPath(path, x, y));
    });

    if (everyPointInSomePath) {
      metadata.endTimestamp = performance.now();
      const completionData = metadata;
      completionData.stimulus = stimulus;
      completionData.clusters = [];
      for (let i = 0; i < clustersData.length; i++) {
        const clusterPath = clusterPaths[i];
        const clusterInfo = {
          edgePoints: clustersData[i],
          pointMembership: stimulus.points.map(point => ({
            point: point,
            member: ctx.isPointInPath(clusterPath, point.x, point.y)
          }))
        };
        completionData.clusters.push(clusterInfo);
      }

      // Prevent single clusters
      if (completionData.clusters.length === 1) {
        completeSingleClusterTrial();
      } else {
        completeTrial(completionData);
      }
    }
  }

  function mouseDownListener(e) {
    currentlyDrawing = true;
    const [x, y] = getXY(e, canvas);
    addClusterPoint(x, y);
    ctx.beginPath();
    ctx.moveTo(x, y);
    currentClusterPath.moveTo(x, y);
  }

  function mouseMoveListener(e) {
    if (currentlyDrawing) {
      const [x, y] = getXY(e, canvas);
      addClusterPoint(x, y);
      ctx.lineTo(x, y);
      ctx.stroke();
      currentClusterPath.lineTo(x, y);
    }
  }

  function mouseUpListener(e) {
    const [x, y] = getXY(e, canvas);
    finishClusterPoint(x, y);
    ctx.closePath();
    ctx.stroke();
    currentClusterPath.closePath(x, y);
    clusterPaths.push(currentClusterPath);
    currentClusterPath = new Path2D();
    currentlyDrawing = false;
    recolorPoints();
    completionCheck();
  }

  ctx.lineWidth = 5;
  for (const { x, y } of stimulus.points) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();

  document.addEventListener("mousedown", mouseDownListener);
  document.addEventListener("mousemove", mouseMoveListener);
  document.addEventListener("mouseup", mouseUpListener);

  // to be used when ending the trial
  removeAllEventListeners = () => {
    document.removeEventListener("mousedown", mouseDownListener);
    document.removeEventListener("mousemove", mouseMoveListener);
    document.removeEventListener("mouseup", mouseUpListener);
  };
}

function trialFunction(displayElement, trial, callback) {
  let numberOfTries = 0;

  const onComplete = data => {
    numberOfTries += 1;
    data = { numberOfTries, ...data };
    displayElement.innerHTML = `<p>You have completed the trial</p>
      <div><button>Continue</button></div>`;
    displayElement.querySelector("button").addEventListener("click", () => {
      // for csv output
      callback({ clusteringData: JSON.stringify(data) });
    });
  };

  const onSingleCluster = () => {
    numberOfTries += 1;
    const p = document.createElement("p");
    p.classList.add("single-cluster-warning");
    p.innerText = "WARNING: PLEASE USE MORE THAN ONE CLUSTER.";
    const continueDiv = document.createElement("div");
    continueDiv.innerHTML = `<button>Retry</button>`;
    continueDiv.addEventListener("click", () => {
      clusterAttempt(displayElement, trial, onComplete, onSingleCluster);
    });
    displayElement.innerHTML = "";
    displayElement.appendChild(p);
    displayElement.appendChild(continueDiv);
  };

  // Start trial

  displayElement.innerHTML = `<p class="measure">Click the button to start the trial. Draw around the points to cluster. Release mouse button to complete cluster. Cluster all the points to end trial. If you get stuck, refresh the page :)</p>
    <button>Begin</button>`;
  displayElement.querySelector("button").addEventListener("click", () => {
    clusterAttempt(displayElement, trial, onComplete, onSingleCluster);
  });
}

export async function clusteringDemo() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  Object.assign(container.style, {
    position: "absolute",
    top: "0",
    left: "0",
    height: "100vh",
    width: "100vw",
    backgroundColor: "white",
    display: "flex"
  });

  const target = document.createElement("div");
  container.appendChild(target);
  Object.assign(target.style, {
    margin: "auto"
  });
  const stimulus = await fetch(
    "4b6dfd3e-5ea1-49bf-8d00-b24f69dfd907.json"
  ).then(x => x.json());

  window.scrollTo(0, 0);
  const data = await new Promise(resolve => {
    trialFunction(target, { stimulus }, resolve);
  });
  console.log(data);
  container.remove();
}
