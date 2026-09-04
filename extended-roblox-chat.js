// ==UserScript==
// @name        Extended Roblox Chat
// @namespace   https://github.com/NalegProto
// @icon        https://images.rbxcdn.com/e854eb7b2951ac03edba9a2681032bba.ico
// @version     2026.09.04
// @description Adds a fullscreen to Roblox Web's private chat
// @author      Naleg
//
// @match       https://www.roblox.com/*
// @grant       none
//
// ==/UserScript==

/*
 * Please note before you read this script
 * My JS sucks
 * My frontend in general sucks
 * If you don't understand what's happening here
 * Don't message me
 * I won't know either
 * */

function fullscreenClicked(fsButton, convContainer) {
  if (fullscreened) {
    // Exit fullscreen
    fullscreened = false;
    convContainer.classList.remove("beegChat");

    // Reset right of inner dialog container
    convContainer.firstChild.style.right = fsRightStorage;

    // Remove background div
    const overlayDiv = document.getElementById("fullscreenChatBackground");
    overlayDiv.remove(); // technically I could just hide it then show it when I need to but I already did it like that and I ain't changing it now

    // Change icon
    fsButton.classList.remove("icon-chat-exit-fullscreen");
    fsButton.classList.add("icon-chat-fullscreen");
  } else {
    fullscreened = true;
    convContainer.classList.add("beegChat");

    // Empty right of inner dialog container
    fsRightStorage = convContainer.firstChild.style.right;
    convContainer.firstChild.style.right = "";

    // Add div behind
    const overlayDiv = document.createElement("div");
    overlayDiv.classList.add("beeg-chat-background");
    overlayDiv.id = "fullscreenChatBackground";
    overlayDiv.style.zIndex = convContainer.firstChild.style.zIndex - 1;
    convContainer.appendChild(overlayDiv);

    // Change icon
    fsButton.classList.remove("icon-chat-fullscreen");
    fsButton.classList.add("icon-chat-exit-fullscreen");

    fullscreened = true;
  }
}

function openChatSettings() {
  // Create settings elements
  const settingDiv = document.createElement("div");
  settingDiv.id = "extrbxchat-settings-menu"
  settingDiv.classList.add("extrbxchat-settings-bg");
  settingDiv.innerHTML = `
<div class="extrbxchat-settings">
    <h1 style="text-align: center;">Extended Roblox Chat</h1>
    <label for="userBubbleColor">Your bubble color in filtered chats</label>
    <input id="userBubbleColor" type="color" style="border: none;">
    <label for="userTrustedBubbleColor">Your bubble color in unfiltered chats</label>
    <input id="userTrustedBubbleColor" type="color" style="border: none;">
    <label for="otherBubbleColor">Others' bubble color</label>
    <input id="otherBubbleColor" type="color" style="border: none;">
    <button id="closeERCSettings" style="
        margin-top: 5px;
        width: fit-content;
    ">Close</button>
</div>
  `

  document.body.appendChild(settingDiv);

  const userBubbleColor = settingDiv.querySelector("#userBubbleColor")
  const userTrustedBubbleColor = settingDiv.querySelector("#userTrustedBubbleColor")
  const otherBubbleColor = settingDiv.querySelector("#otherBubbleColor")
  const closeButton = settingDiv.querySelector("#closeERCSettings");

  // Put value as saved elem if present

  if (window.localStorage.getItem("ERC.outboundBubbleColor")) {
    userBubbleColor.value = window.localStorage.getItem("ERC.outboundBubbleColor");
  }

  if (window.localStorage.getItem("ERC.outboundTrustedBubbleColor")) {
    userTrustedBubbleColor.value = window.localStorage.getItem("ERC.outboundTrustedBubbleColor");
  }

  if (window.localStorage.getItem("ERC.inboundBubbleColor")) {
    otherBubbleColor.value = window.localStorage.getItem("ERC.inboundBubbleColor");
  }

  // Give each input a function
  // I have learnt of HTMLElement.querySelector and I WILL overuse it

  closeButton.onclick = closeChatSettings;

  userBubbleColor.onchange = () => {
    window.localStorage.setItem("ERC.outboundBubbleColor", userBubbleColor.value)
  }

  userTrustedBubbleColor.onchange = () => {
    window.localStorage.setItem("ERC.outboundTrustedBubbleColor", userTrustedBubbleColor.value)
  }

  otherBubbleColor.onchange = () => {
    window.localStorage.setItem("ERC.inboundBubbleColor", otherBubbleColor.value)
  }
}

function closeChatSettings() {
  const settingsDiv = document.getElementById("extrbxchat-settings-menu");
  settingsDiv.remove();
  applySavedChatSettings();
}

function applySavedChatSettings() {
  if (window.localStorage.getItem("ERC.outboundBubbleColor")) {
    document.documentElement.style.setProperty("--commOutboundColor", window.localStorage.getItem("ERC.outboundBubbleColor"))
  }

  if (window.localStorage.getItem("ERC.outboundTrustedBubbleColor")) {
    document.documentElement.style.setProperty("--trustedCommOutboundColor", window.localStorage.getItem("ERC.outboundTrustedBubbleColor"))
  }

  /*
  if (window.localStorage.getItem("ERC.inboundBubbleColor")) {
    document.documentElement.style.setProperty("--commInboundColor", window.localStorage.getItem("ERC.inboundBubbleColor"))
  }
  */
}
// TODO : Load chat settings

var fsRightStorage = "";
var fullscreened = false;

// beeg chat style
const beegChatStyle = document.createElement("style")
beegChatStyle.id = "ChatParams_beegChat"
beegChatStyle.innerHTML = `
:root {
  --currChatHeight: 360px;
  --currChatWidth: 360px;

  --trustedCommOutboundColor: #335fff;
  --commOutboundColor: #494d5a;
  /*
    Inbound color is managed by var --color-surface-200
    yes they use a var for that but not for the other bubbles
  */
}

.beegChat * {
  --currChatHeight: 90vh;
  --currChatWidth: 90vw;
}

.beegChat .dialog-container {
    height: var(--currChatHeight);
    width: var(--currChatWidth);
    bottom: calc(50vh - var(--currChatHeight) / 2);
    right: calc(50vw - var(--currChatWidth) / 2);
}

.beegChat .message-piece.font-caption-body, .beegChat .message-piece.font-caption-body:hover {
    font-size: 16px;
}

.beeg-chat-background {
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0px;
  background-color: rgba(0, 0, 0, 0.9);
}

.icon-chat-back.icon-chat-fullscreen {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KCjxwYXRoIGQ9Ik0yMS43MDkyIDIuMjk1MDJDMjEuODA0MSAyLjM5MDQgMjEuODc1NyAyLjUwMDE0IDIxLjkyNDEgMi42MTcyMkMyMS45NzI3IDIuNzM0MjUgMjEuOTk5NiAyLjg2MjUgMjIgMi45OTdMMjIgM1Y5QzIyIDkuNTUyMjggMjEuNTUyMyAxMCAyMSAxMEMyMC40NDc3IDEwIDIwIDkuNTUyMjggMjAgOVY1LjQxNDIxTDE0LjcwNzEgMTAuNzA3MUMxNC4zMTY2IDExLjA5NzYgMTMuNjgzNCAxMS4wOTc2IDEzLjI5MjkgMTAuNzA3MUMxMi45MDI0IDEwLjMxNjYgMTIuOTAyNCA5LjY4MzQyIDEzLjI5MjkgOS4yOTI4OUwxOC41ODU4IDRIMTVDMTQuNDQ3NyA0IDE0IDMuNTUyMjggMTQgM0MxNCAyLjQ0NzcyIDE0LjQ0NzcgMiAxNSAySDIwLjk5OThDMjEuMjc0OSAyIDIxLjUyNDIgMi4xMTEwNiAyMS43MDUgMi4yOTA3OEwyMS43MDkyIDIuMjk1MDJaIiBmaWxsPSIjZmZmZmZmIj48L3BhdGg+CjxwYXRoIGQ9Ik0xMC43MDcxIDE0LjcwNzFMNS40MTQyMSAyMEg5QzkuNTUyMjggMjAgMTAgMjAuNDQ3NyAxMCAyMUMxMCAyMS41NTIzIDkuNTUyMjggMjIgOSAyMkgzLjAwMDY5TDIuOTk3IDIyQzIuNzQzMDEgMjEuOTk5MiAyLjQ4OTI0IDIxLjkwMjMgMi4yOTUwMiAyMS43MDkyTDIuMjkwNzggMjEuNzA1QzIuMTk1OTUgMjEuNjA5NiAyLjEyNDMyIDIxLjQ5OTkgMi4wNzU4OCAyMS4zODI4QzIuMDI2OTkgMjEuMjY0OSAyIDIxLjEzNTYgMiAyMVYxNUMyIDE0LjQ0NzcgMi40NDc3MiAxNCAzIDE0QzMuNTUyMjggMTQgNCAxNC40NDc3IDQgMTVWMTguNTg1OEw5LjI5Mjg5IDEzLjI5MjlDOS42ODM0MiAxMi45MDI0IDEwLjMxNjYgMTIuOTAyNCAxMC43MDcxIDEzLjI5MjlDMTEuMDk3NiAxMy42ODM0IDExLjA5NzYgMTQuMzE2NiAxMC43MDcxIDE0LjcwNzFaIiBmaWxsPSIjRkZGRkZGIj48L3BhdGg+Cgo8L3N2Zz4=");
  background-position: 0px 0px;
  background-size: 20px auto;

}

.icon-chat-back.icon-chat-exit-fullscreen {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KCjxwYXRoIGQ9Ik0yMS43MDcxIDMuNzA3MTFMMTYuNDE0MiA5SDIwQzIwLjU1MjMgOSAyMSA5LjQ0NzcyIDIxIDEwQzIxIDEwLjU1MjMgMjAuNTUyMyAxMSAyMCAxMUgxNC4wMDA3TDEzLjk5NyAxMUMxMy43NDMgMTAuOTk5MiAxMy40ODkyIDEwLjkwMjMgMTMuMjk1IDEwLjcwOTJMMTMuMjkwOCAxMC43MDVDMTMuMTk2IDEwLjYwOTYgMTMuMTI0MyAxMC40OTk5IDEzLjA3NTkgMTAuMzgyOEMxMy4wMjczIDEwLjI2NTcgMTMuMDAwNCAxMC4xMzc1IDEzIDEwLjAwM0wxMyAxMFY0QzEzIDMuNDQ3NzIgMTMuNDQ3NyAzIDE0IDNDMTQuNTUyMyAzIDE1IDMuNDQ3NzIgMTUgNFY3LjU4NTc5TDIwLjI5MjkgMi4yOTI4OUMyMC42ODM0IDEuOTAyMzcgMjEuMzE2NiAxLjkwMjM3IDIxLjcwNzEgMi4yOTI4OUMyMi4wOTc2IDIuNjgzNDIgMjIuMDk3NiAzLjMxNjU4IDIxLjcwNzEgMy43MDcxMVoiIGZpbGw9IiNGRkZGRkYiPjwvcGF0aD4KPHBhdGggZD0iTTkgMjBDOSAyMC41NTIzIDkuNDQ3NzIgMjEgMTAgMjFDMTAuNTUyMyAyMSAxMSAyMC41NTIzIDExIDIwVjE0LjAwMDdDMTEgMTMuOTk5NyAxMSAxMy45OTggMTEgMTMuOTk3QzEwLjk5OTIgMTMuNzIzMSAxMC44ODgzIDEzLjQ3NTIgMTAuNzA5MiAxMy4yOTVDMTAuNzA3OCAxMy4yOTM2IDEwLjcwNjQgMTMuMjkyMiAxMC43MDUgMTMuMjkwOEMxMC42MDk2IDEzLjE5NiAxMC40OTk5IDEzLjEyNDMgMTAuMzgyOCAxMy4wNzU5QzEwLjI2NTcgMTMuMDI3MyAxMC4xMzc1IDEzLjAwMDQgMTAuMDAzIDEzQzEwLjAwMiAxMyAxMC4wMDEgMTMgMTAgMTNINEMzLjQ0NzcyIDEzIDMgMTMuNDQ3NyAzIDE0QzMgMTQuNTUyMyAzLjQ0NzcyIDE1IDQgMTVINy41ODU3OUwyLjI5Mjg5IDIwLjI5MjlDMS45MDIzNyAyMC42ODM0IDEuOTAyMzcgMjEuMzE2NiAyLjI5Mjg5IDIxLjcwNzFDMi42ODM0MiAyMi4wOTc2IDMuMzE2NTggMjIuMDk3NiAzLjcwNzExIDIxLjcwNzFMOSAxNi40MTQyVjIwWiIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgoKPC9zdmc+");
  background-position: 0px 0px;
  background-size: 20px auto;
}

.icon-extrbxchat-chat-settings {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KCiAgICA8Zz4KICAgICAgICA8cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDI0djI0SDB6Ij48L3BhdGg+CiAgICAgICAgPHBhdGggZD0iTTIyIDEyaC0yVjVINHYxMy4zODVMNS43NjMgMTdIMTJ2Mkg2LjQ1NUwyIDIyLjVWNGExIDEgMCAwIDEgMS0xaDE4YTEgMSAwIDAgMSAxIDF2OHptLTcuODU1IDcuMDcxYTQuMDA0IDQuMDA0IDAgMCAxIDAtMi4xNDJsLS45NzUtLjU2MyAxLTEuNzMyLjk3Ni41NjNBMy45OTYgMy45OTYgMCAwIDEgMTcgMTQuMTI2VjEzaDJ2MS4xMjZjLjcxNS4xODQgMS4zNTMuNTYgMS44NTQgMS4wNzFsLjk3Ni0uNTYzIDEgMS43MzItLjk3NS41NjNhNC4wMDQgNC4wMDQgMCAwIDEgMCAyLjE0MmwuOTc1LjU2My0xIDEuNzMyLS45NzYtLjU2M2MtLjUwMS41MS0xLjE0Ljg4Ny0xLjg1NCAxLjA3MVYyM2gtMnYtMS4xMjZhMy45OTYgMy45OTYgMCAwIDEtMS44NTQtMS4wNzFsLS45NzYuNTYzLTEtMS43MzIuOTc1LS41NjN6TTE4IDIwYTIgMiAwIDEgMCAwLTQgMiAyIDAgMCAwIDAgNHoiIGZpbGw9IiNGRkZGRkYiPjwvcGF0aD4KICAgIDwvZz4KCjwvc3ZnPg==");
  background-size: contain;
  height: 28px;
  width: 28px;
  background-color: unset;
  background-position: 0px 0px;
  border: none;
  vertical-align: middle;
}

.extrbxchat-chat-setting-opt {
  border: none;
}

.extrbxchat-settings-bg {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  top: 0px;
  z-index: 2000;
  align-content: center;
}

.extrbxchat-settings {
  height: 70%;
  width: 25%;
  background-color: var(--color-action-over-media-foreground);
  margin: auto;
  border-radius: 2vh;
  display: flex;
  flex-direction: column;
  column-count: 2;
  padding: 2px 10px;
}

/* Chat bubbles style replacing, dark theme only cuz light theme users don't exist frfr */
.dark-theme .dialogs .dialog-container .dialog-message-container .dialog-message.trusted-comms {
  background-color: var(--trustedCommOutboundColor);
  border-color: var(--trustedCommOutboundColor);
}

.dark-theme .dialogs .dialog-container .dialog-message-container .dialog-message {
  background-color: var(--commOutboundColor);
  border-color: var(--commOutboundColor);
}
`

document.head.appendChild(beegChatStyle);

// Add settings button to topright navbar
/*
const topRightNavbar = document.querySelector("#right-navigation-header > .navbar-right > .rbx-navbar-icon-group");

const chatSettingsLi = document.createElement("li");
chatSettingsLi.id = "extrbxchat-settings";
chatSettingsLi.style.position = "relative";
topRightNavbar.appendChild(chatSettingsLi)

const chatSettingsBut = document.createElement("button");
chatSettingsBut.classList.add("icon-extrbxchat-chat-settings");
chatSettingsLi.appendChild(chatSettingsBut);
*/

const observer = new MutationObserver(function(mutations, observer) {
  console.log("Detected mutation");

  // Work on divs we actually want
  // We're interested by :
  // Chat containers (id "conv_UUID")
  // => Only if it's a childList mutation
  // => And if we open it (adding node)
  // => And if that node is not the background div
  // Inner dialog container (id dialog-container-UUID OR direct child of outer conv container)
  // => Only if it's an attribute mutation
  // => And we're fullscreened
  // => And style.right is not empty
  // Settings (id navbar-settings)
  // => Only if we open them (adding node)

  // Those two edits might be a bit epileptic, since I don't know what's resetting them and I'm pretty sure I can't re-edit before it's rendered
  // Probably a script in the background doing it
  // I could potentially overwrite the function but it would break other stuff
  for (const v of mutations) {
    const mutTarget = v.target;

    // boooo nested ifs
    if (v.type == "childList") {

      // Checking if chat container
      if (mutTarget.id.startsWith("conv_")) {
        if (v.addedNodes.length >= 1) {
          if (v.addedNodes[0].id != "fullscreenChatBackground") {
            // build id of message container
            const uuid = mutTarget.id.split("_")[1];
            const contID = "scrollbar_0_conv_" + uuid;

            // change height of element
            // why did roblox set this size in the element directly ? even tho they already have a .dialog-container .dialog-body ruleset with it ? idk ask their devs
            const messageContainer = document.getElementById(contID);
            console.log("Changing height of message container");
            messageContainer.style.height = "calc(var(--currChatHeight) - 68px)";

            // add fullscreen button
            const chatHeaderButtons = document.querySelector(`#${mutTarget.id} div.chat-windows-header.dialog-header > div.chat-header-action`);
            console.log(chatHeaderButtons);
            const fullscreenButton = document.createElement("span");
            fullscreenButton.setAttribute("class", "icon-chat-back icon-chat-fullscreen");
            chatHeaderButtons.appendChild(fullscreenButton);

            fullscreenButton.onclick = () => fullscreenClicked(fullscreenButton, mutTarget);
          }
        }
      }

      // Checking if settings
      if (mutTarget.id == "navbar-settings") {
        if (v.addedNodes.length >= 1) {
          const popover = document.getElementById("settings-popover-menu");

          // Create option
          const chatsetLi = document.createElement("li");
          const chatsetButton = document.createElement("button");
          chatsetButton.innerText = "Chat Settings";

          chatsetLi.appendChild(chatsetButton);
          popover.insertBefore(chatsetLi, popover.children[1]);

          chatsetButton.onclick = openChatSettings;
        }
      }
    }

    if (v.type == "attributes") {
      // Checking if inner dialog container
      if (mutTarget.id.startsWith("dialog-container-")) {
        if (fullscreened) {
          if (mutTarget.style.right != "") {
            mutTarget.style.right = "";
          }
        }
      }
    }
  }
});

// observe chat container
const dialogContainer = document.getElementById("dialogs");

observer.observe(dialogContainer, {
  childList: true,
  attributes: true,
  subtree: true
});

// observe when settings open
const settingsButton = document.getElementById("navbar-settings");

observer.observe(settingsButton, {
  childList: true
})

applySavedChatSettings();

