async function getData(word) {
  console.clear();
  await ClearScreen();
  NumberOfSlides = 0;
  Source.href = `https://en.wiktionary.org/wiki/${word}`;

  try {
    let response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    let data = await response.json();
    loader.innerHTML = "";
    if (response.ok === true) {
      console.log(data);
      if (data[0].phonetic !== "" && data[0].phonetic !== undefined) {
        // Check if the phonetic text is stored in the `phonetic` property
        WORD.innerHTML = `<h1>${word}</h1>\n<p class = "para">${data[0].phonetic}</p>`; //Displaying The word
      } else if (data[0].phonetics === "" && data[0].phonetics === undefined) {
        WORD.innerHTML = `<h1>${word}</h1>`;
      } else if (
        (data[0].phonetics[0].text !== "" &&
          data[0].phonetics[0].text !== undefined) ||
        (data[0].phonetics.hasOwnProperty(1) &&
          data[0].phonetics[1].text !== undefined &&
          data[0].phonetics[1].text !== "")
      ) {
        // Check if the phonetic text is stored in the `phonetics[0].text` property or the `phonetics[1].text` property
        WORD.innerHTML = `<h1>${word}</h1>\n<p class = "para">${
          data[0].phonetics[0].text || data[0].phonetics[1].text
        }</p>`;
      } else {
        // The phonetic text is not stored in any of the known locations
        WORD.innerHTML = `<h1>${word}</h1>`;
      }
      let dis = 99;
      scrollNext = 0;

      for (let i = 0; i < data.length; i++) {
        for (let a = 0; a < data[i].meanings.length; a++) {
          //For Getting Synonyms
          for (let z = 0; z < data[i].meanings[a].synonyms.length; z++) {
            let synonyms = data[i].meanings[a].synonyms[z]; //Here we have access to all the synonyms

            SynonymsDiv.innerHTML = SynonymsDiv.innerHTML + `${synonyms}, `;
          }
          //For getting Antonyms
          for (let j = 0; j < data[i].meanings[a].antonyms.length; j++) {
            let antonyms = data[i].meanings[a].antonyms[j]; //Here we have access to all the antonyms

            AntonymsDiv.innerHTML = AntonymsDiv.innerHTML + `${antonyms}, `;
          }
          //For getting Definitions
          for (let c = 0; c < data[i].meanings[a].definitions.length; c++) {
            let def = data[i].meanings[a].definitions[c].definition; //Here we have access to all the def
            let Examples = data[i].meanings[a].definitions[c].example; //Accessed examples!!!!
            let partOfSpeech = data[i].meanings[a].partOfSpeech;
            let slide = document.createElement("div");
            if (Examples !== undefined) {
              slide.innerHTML = `<p class = "partOfSpeech">${partOfSpeech}</p>\n<p><b class = "eg"> Definition : </b>${def}</p>\n<p> <b class = "eg" >Example : </b>\n${Examples}</p>`;
            } else {
              slide.innerHTML = `<p class = "partOfSpeech">${partOfSpeech}</p>\n<p><b class = "eg"> Definition : </b>${def}</p>\n<p> <b class = "eg" >Example : </b>\n Not Found ●︿● </p>`;
            }
            slide.classList.add("slide");
            slide.style.zIndex = dis;
            --dis;
            if (def !== "") {
              ++NumberOfSlides;
            }
            slides.appendChild(slide);
          }
        }
      }
      const newHTML2 = SynonymsDiv.innerHTML.replace(/^./, function (match) {
        return match.toUpperCase();
      });

      SynonymsDiv.innerHTML = newHTML2;
      const newHTML3 = AntonymsDiv.innerHTML.replace(/^./, function (match) {
        return match.toUpperCase();
      });
      console.log(NumberOfSlides);
      AntonymsDiv.innerHTML = newHTML3;
      let newHTML = SynonymsDiv.innerHTML.replace(/,(?=[^,]*$)/, "."); // Use of Regular Expression.
      let newHTML1 = AntonymsDiv.innerHTML.replace(/,(?=[^,]*$)/, ".");
      SynonymsDiv.innerHTML = newHTML;
      AntonymsDiv.innerHTML = newHTML1;
      if ((polllla = 2)) {
        document.querySelector(".SYNONYMSPARA").innerHTML =
          SynonymsDiv.innerHTML;
        document.querySelector(".ANTONYMSPARA").innerHTML =
          AntonymsDiv.innerHTML;
      }

      input.classList.remove("focus");
      WARN.innerHTML = "";
      Volume.style.display = "flex";
      content.style.display = "flex";
      Source.style.display = "flex";
      document.querySelector("hr").style.display = "block";
      if (SynonymsDiv.innerHTML === ``) {
        document.querySelector(".Synonyms ").innerHTML =
          document.querySelector(".Synonyms ").innerHTML +
          `<dotlottie-player src="https://lottie.host/c4523843-ae15-42de-b693-47f0f536edb6/vhiYPYdkqV.json" background="transparent" speed="1" style="width: width = "auto"; height: "200px";" loop autoplay></dotlottie-player>`;
      }
      if (AntonymsDiv.innerHTML === ``) {
        document.querySelector(".Antonyms ").innerHTML =
          document.querySelector(".Antonyms ").innerHTML +
          `<dotlottie-player src="https://lottie.host/c4523843-ae15-42de-b693-47f0f536edb6/vhiYPYdkqV.json" background="transparent" speed="1" style="width: width = "auto"; height: "200px";" loop autoplay></dotlottie-player>`;
      }
      // Hide the prev button on the first slide
      prev.style.display = scrollNext === 0 ? "none" : "block";

      // Hide the next button on the last slide
      next.style.display = scrollNext === NumberOfSlides - 1 ? "none" : "block";
    } else {
      switch (data.message) {
        case "Sorry pal, we couldn't find definitions for the word you were looking for.": //Not found error
          input.focus();
          input.classList.add("focus");
          WARN.innerHTML = "Not Found!";
          loader.innerHTML = `<dotlottie-player src="https://lottie.host/0f6da3f8-8373-4160-97e5-7766acbce832/EEYYXebJ07.json" background="transparent" speed="1" style="width: 300px; height: 300px;" loop autoplay></dotlottie-player>\n<p>Not found! Try checking for a typo.</p>`;
          break;
        default:
          console.error("Fetch was successful!", error);
      }
    }
  } catch (error) {
    switch (error.message) {
      case "Failed to fetch": //Internet Problem
        input.focus();
        input.classList.add("focus");
        WARN.innerHTML = "Internet Connection Was Disabled";
        loader.innerHTML = `<dotlottie-player src="https://lottie.host/0f6da3f8-8373-4160-97e5-7766acbce832/EEYYXebJ07.json" background="transparent" speed="1" style="width: 300px; height: 300px;" loop autoplay></dotlottie-player>\n<p> Check Your Internet.</p>`;

        break;
      case `Unexpected token '<', "<!DOCTYPE "... is not valid JSON`:
        input.focus();
        input.classList.add("focus");
        WARN.innerHTML = "Not Found!";
        loader.innerHTML = `<dotlottie-player src="https://lottie.host/0f6da3f8-8373-4160-97e5-7766acbce832/EEYYXebJ07.json" background="transparent" speed="1" style="width: 300px; height: 300px;" loop autoplay></dotlottie-player>\n<p>Not found! Try checking for a typo.</p>`;
        break;
      default:
        console.error("Fetch Error", error);
    }
  }
}
function ConfirmUserInputThenFetch() {
  if (word !== "") {
    loader.innerHTML = `<img src="/Images,logos,videos,Gifs/Bean Eater-1s-200px.gif" alt="loader" height = " 50 px" width = "auto">`;
    getData(word);

    input.placeholder = "Search English";
  } else {
    input.placeholder = "Enter a word";
  }
}
async function ClearScreen() {
  slides.innerHTML = ""; //Clears screen
  WORD.innerHTML = "";
  SynonymsDiv.innerHTML = "";
  AntonymsDiv.innerHTML = "";
  Volume.style.display = "none";
  content.style.display = "none";
  Source.style.display = "none";
  document.querySelector("hr").style.display = "none";
  if (document.querySelector(".Synonyms ").children.length === 3) {
    polllla = 2;
    console.log("yes 1");
    document.querySelector(".Synonyms ").children[2].remove();
  }
  if (document.querySelector(".Antonyms ").children.length === 3) {
    polllla = 2;
    console.log("yes 2");
    document.querySelector(".Antonyms ").children[2].remove();
  }
}
let polllla = 1;
const content = document.querySelector(".content");
const loader = document.querySelector(".loader");
const input = document.querySelector(".input");
const WARN = document.querySelector(".Warn");
const button = document.getElementById("button");
const WORD = document.querySelector(".word");
const Volume = document.querySelector(".VolumeLogo");
const slides = document.querySelector(".slides");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const SynonymsDiv = document.querySelector(".SYNONYMSPARA");
const AntonymsDiv = document.querySelector(".ANTONYMSPARA");
const Source = document.querySelector("#source");
let utterance;
let word;
let NumberOfSlides = 0;
let children = slides.children;
let scrollNext = 0;
let sound;
Volume.style.display = "none";

input.addEventListener("keypress", function () {
  if (event.keyCode === 13) {
    //13 === enter.KeyCode
    // The user has pressed Enter
    word = input.value;
    input.blur();
    ConfirmUserInputThenFetch();
  }
});
button.addEventListener("click", function () {
  // The user has clicked the button
  word = input.value;
  ConfirmUserInputThenFetch();
});

Volume.addEventListener("click", function () {
  utterance = new SpeechSynthesisUtterance(`${word}`);
  speechSynthesis.speak(utterance);
});

prev.addEventListener("click", function () {
  // Calculate the scrollBack variable
  let scrollBack = scrollNext;
  if (scrollBack > 0) {
    scrollBack--;

    // Hide the current slide
    children[scrollNext].style.display = "none";

    // Show the previous slide
    children[scrollBack].style.display = "flex";

    // Add the reverse animation class to the previous slide
    children[scrollBack].classList.add("reverse");

    // Remove the reverse animation class from the current slide after 500ms
    setTimeout(function () {
      children[scrollBack].classList.remove("reverse");
    }, 500);

    // Update the scrollNext variable
    scrollNext = scrollBack;
  }

  // Update the display of the prev and next buttons
  prev.style.display = scrollNext === 0 ? "none" : "block";
  next.style.display = scrollNext === NumberOfSlides - 1 ? "none" : "block";
});

next.addEventListener("click", function () {
  if (scrollNext !== NumberOfSlides - 1) {
    // Hide the current slide
    children[scrollNext].style.display = "none";

    // Show the next slide
    children[scrollNext + 1].style.display = "flex";

    // Add the reverse animation class to the next slide
    children[scrollNext + 1].classList.add("reverse");

    // Remove the reverse animation class from the current slide after 500ms
    setTimeout(function () {
      children[scrollNext].classList.remove("reverse");
    }, 500);

    // Increment the scrollNext variable
    scrollNext++;
  }

  // Update the display of the prev and next buttons
  prev.style.display = scrollNext === 0 ? "none" : "block";
  next.style.display = scrollNext === NumberOfSlides - 1 ? "none" : "block";
});
