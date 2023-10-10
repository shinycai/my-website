/* global videojs */
/* eslint-disable camelcase */
const brightCoveVideoTemplate = ({
  account_id,
  player_id,
  video_id,
  title_text,
}) => `
<div class="video-container ">
    <video-js
        id="player"
        data-account="${account_id}"
        data-player="${player_id}"
        data-video-id="${video_id}"
        data-embed="default"
        loop="true"
        muted="true"
        preload="true"
        class="vjs-fluid"
        controls
        >
    </video-js>
    <div class="video-title"><p>${title_text}</p></div>
</div>
`;

/**
 * Reads the video data from the block
 */
function readVideoData(block) {
  return [...block.children].reduce((data, div) => {
    if (div.children.length === 2) {
      data[div.children[0].innerText.trim().toLowerCase()] =
        div.children[1].innerText.trim();
    }
    return data;
  }, {});
}

/**
 * Loads the video player
 */
async function loadPlayer(block) {
  const script = document.createElement("script");
  script.src =
    "https://players.brightcove.net/1852113022001/g2OtgoAoBs_default/index.min.js";
  block.append(script);
  // wait for the script to load
  await new Promise((res) => {
    script.addEventListener("load", res);
  });
  // wait for the player to get ready
  return new Promise((res) => {
    videojs.getPlayer("player").ready(function onPlayerReady() {
      res(this);
    });
  });
}

export default async function decorate(block) {
  const videoData = readVideoData(block);
  const { account_id, player_id, video_id } = videoData;
  if (video_id && player_id && account_id) {
    block.innerHTML = brightCoveVideoTemplate(videoData);
    await loadPlayer(block);
  } else {
    console.error(
      "Missing Brightcove video data, video_id, player_id and account_id ``are required!"
    );
  }
}
