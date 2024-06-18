document.addEventListener("DOMContentLoaded", function () {
  const dropzoneElement = document.getElementById("dropzone");
  const imageContainer = document.getElementById("image-container");
  const imageBoxes = document.querySelectorAll(".image-box");
  const modal = document.getElementById("editPopup");
  const closeModal = modal.querySelector(".close");
  let currentBox = null;

  const dropzone = new Dropzone(dropzoneElement, {
    url: "/file-upload",
    autoProcessQueue: false,
    maxFiles: 24,
    init: function () {
      this.on("addedfile", function (file) {
        this.removeFile(file);

        const reader = new FileReader();
        reader.onload = (e) => {
          const emptyBox = Array.from(imageBoxes).find((box) =>
            box.classList.contains("empty")
          );
          if (emptyBox) {
            emptyBox.classList.remove("empty");
            emptyBox.classList.add("filled");
            const img = document.createElement("img");
            img.src = e.target.result;
            emptyBox.appendChild(img);
          } else {
            alert("You have reached the maximum number of images.");
          }
        };
        reader.readAsDataURL(file);
      });

      document.getElementById("uploadButton").addEventListener("click", () => {
        this.hiddenFileInput.click();
      });
    },
  });

  imageBoxes.forEach((box) => {
    box.addEventListener("click", () => {
      const img = box.querySelector("img");
      if (img && img.src) {
        showImageEditorModal(box);
      } else {
        dropzone.hiddenFileInput.click();
      }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
    box.appendChild(deleteBtn);

    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      handleDelete(box);
    });
  });

  new Sortable(imageContainer, {
    animation: 150,
    ghostClass: "sortable-ghost",
  });

  closeModal.onclick = function () {
    modal.style.display = "none";
  };

  function handleDelete(box) {
    const currentIndex = Array.from(imageBoxes).indexOf(box);
    for (let i = currentIndex; i < imageBoxes.length - 1; i++) {
      const nextBox = imageBoxes[i + 1];
      const img = nextBox.querySelector("img");
      if (img) {
        const newImg =
          imageBoxes[i].querySelector("img") || document.createElement("img");
        newImg.src = img.src;
        if (!imageBoxes[i].contains(newImg)) {
          imageBoxes[i].appendChild(newImg);
        }
        imageBoxes[i].classList.remove("empty");
        imageBoxes[i].classList.add("filled");
      } else {
        imageBoxes[i].classList.remove("filled");
        imageBoxes[i].classList.add("empty");
        const existingImg = imageBoxes[i].querySelector("img");
        if (existingImg) {
          imageBoxes[i].removeChild(existingImg);
        }
      }
    }
    const lastBox = imageBoxes[imageBoxes.length - 1];
    lastBox.classList.remove("filled");
    lastBox.classList.add("empty");
    const lastImg = lastBox.querySelector("img");
    if (lastImg) {
      lastBox.removeChild(lastImg);
    }
  }

  function showImageEditorModal(box) {
    const img = box.querySelector("img");
    const modalImage = modal.querySelector("#Image");
    modalImage.src = img.src;
    modal.style.display = "block";
    currentBox = box;
  }

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});

document.addEventListener("DOMContentLoaded", () => {
  const cropButton = document.getElementById("crop-button");
  const adjustButton = document.getElementById("adjust-button");
  const annotateButton = document.getElementById("annotate-button");
  const filterButton = document.getElementById("filter-button");
  const textButton = document.getElementById("text-button");
  const undoButton = document.getElementById("undo-button");
  const Image = document.getElementById("Image");

  let cropper, canvas, camanInstance;

  // Cropper.js for cropping
  cropButton.addEventListener("click", () => {
    if (cropper) {
      cropper.destroy();
    }
    cropper = new Cropper(Image, {
      aspectRatio: 16 / 9,
      viewMode: 1,
      autoCropArea: 0.5,
      movable: false,
      zoomable: false,
      rotatable: false,
      scalable: false,
    });
  });

  // Fabric.js for annotations
  annotateButton.addEventListener("click", () => {
    if (cropper) {
      cropper.destroy();
      cropper = null;
    }

    if (!canvas) {
      canvas = new fabric.Canvas("Image", {
        isDrawingMode: true,
      });
    } else {
      canvas.isDrawingMode = !canvas.isDrawingMode;
    }
  });

  // Caman.js for filters
  filterButton.addEventListener("click", () => {
    if (cropper) {
      cropper.destroy();
      cropper = null;
    }

    Caman("#Image", function () {
      this.brightness(10).render();
    });
  });

  // Text tool using Fabric.js
  textButton.addEventListener("click", () => {
    if (cropper) {
      cropper.destroy();
      cropper = null;
    }

    if (!canvas) {
      canvas = new fabric.Canvas("Image");
    }

    const text = new fabric.IText("Tap and Type", {
      left: 50,
      top: 100,
      fill: "#000",
      fontSize: 20,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
  });

  // Undo functionality
  undoButton.addEventListener("click", () => {
    if (cropper) {
      cropper.destroy();
      cropper = null;
    }

    if (canvas) {
      const objects = canvas.getObjects();
      if (objects.length > 0) {
        canvas.remove(objects[objects.length - 1]);
      }
    }
  });

  // "Done" button functionality to apply changes and close the modal
  document.querySelector(".done-button").addEventListener("click", () => {
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();
      Image.src = croppedCanvas.toDataURL();
      cropper.destroy();
      cropper = null;
    }

    if (canvas) {
      const dataURL = canvas.toDataURL();
      Image.src = dataURL;
      canvas.dispose();
      canvas = null;
    }

    modal.style.display = "none";
  });
});

// leave box empty after delete version : ---

// Dropzone.autoDiscover = false;

// document.addEventListener('DOMContentLoaded', () => {
//     const dropzoneElement = document.getElementById('dropzone');
//     const imageContainer = document.getElementById('image-container');
//     const imageBoxes = imageContainer.querySelectorAll('.image-box');
//     let currentBox = null;
//     let replaceImage = false;

//     const dropzone = new Dropzone(dropzoneElement, {
//         url: '/file-upload',
//         autoProcessQueue: false,
//         maxFiles: 24,
//         init: function() {
//             this.on("addedfile", function(file) {
//                 this.removeFile(file);

//                 const reader = new FileReader();
//                 reader.onload = (e) => {
//                     if (replaceImage && currentBox) {
//                         let img = currentBox.querySelector('img');
//                         if (!img) {
//                             img = document.createElement('img');
//                             currentBox.appendChild(img);
//                         }
//                         img.src = e.target.result;
//                         currentBox.classList.remove('empty');
//                         currentBox.classList.add('filled');
//                         replaceImage = false;
//                         currentBox = null;
//                     } else {
//                         const emptyBox = Array.from(imageBoxes).find(box => box.classList.contains('empty'));
//                         if (emptyBox) {
//                             let img = emptyBox.querySelector('img');
//                             if (!img) {
//                                 img = document.createElement('img');
//                                 emptyBox.appendChild(img);
//                             }
//                             img.src = e.target.result;
//                             emptyBox.classList.remove('empty');
//                             emptyBox.classList.add('filled');
//                         } else {
//                             alert("You have reached the maximum number of images.");
//                         }
//                     }
//                 };
//                 reader.readAsDataURL(file);
//             });

//             document.getElementById('uploadButton').addEventListener('click', () => {
//                 this.hiddenFileInput.click();
//             });
//         }
//     });

//     imageBoxes.forEach(box => {
//         box.addEventListener('click', () => {
//             if (box.classList.contains('filled')) {
//                 replaceImage = true;
//                 currentBox = box;
//             } else {
//                 replaceImage = false;
//             }
//             dropzone.hiddenFileInput.click();
//         });

//         const deleteBtn = document.createElement('button');
//         deleteBtn.classList.add('delete-btn');
//         deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
//         box.appendChild(deleteBtn);

//         deleteBtn.addEventListener('click', (e) => {
//             e.stopPropagation(); // Prevent triggering the box click event
//             box.classList.remove('filled');
//             box.classList.add('empty');
//             const img = box.querySelector('img');
//             if (img) {
//                 box.removeChild(img);
//             }
//         });
//     });

//     new Sortable(imageContainer, {
//         animation: 150,
//         ghostClass: 'sortable-ghost',
//     });
// });
