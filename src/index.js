let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyForm = document.querySelector(".add-toy-form");
  const toyCollection = document.getElementById("toy-collection");

  // Event listener for toggling the add toy form visibility
  addBtn.addEventListener("click", () => {
    toggleToyForm();
  });

  // Event listener for submitting new toy form
  toyForm.addEventListener("submit", event => {
    event.preventDefault();
    const name = event.target.elements.name.value;
    const image = event.target.elements.image.value;
    addNewToy(name, image);
  });

  // Function to fetch and display all toys
  function fetchToys() {
    fetch("http://localhost:3000/toys")
      .then(response => response.json())
      .then(toys => {
        toys.forEach(toy => {
          const toyCard = createToyCard(toy);
          toyCollection.appendChild(toyCard);
        });
      })
      .catch(error => {
        console.error('Error fetching toys:', error);
      });
  }

  // Function to add a new toy
  function addNewToy(name, image) {
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: name,
        image: image,
        likes: 0 // Initial likes set to 0
      })
    })
    .then(response => response.json())
    .then(toy => {
      const toyCard = createToyCard(toy);
      toyCollection.appendChild(toyCard);
      // Optional: Reset the form after successfully adding a toy
      document.querySelector(".add-toy-form").reset();
    })
    .catch(error => {
      console.error('Error adding new toy:', error);
    });
  }

  // Function to create a toy card
  function createToyCard(toy) {
    const card = document.createElement("div");
    card.className = "card";

    const h2 = document.createElement("h2");
    h2.textContent = toy.name;

    const img = document.createElement("img");
    img.src = toy.image;
    img.className = "toy-avatar";

    const p = document.createElement("p");
    p.textContent = `${toy.likes} Likes`;

    const button = document.createElement("button");
    button.className = "like-btn";
    button.id = toy.id;
    button.textContent = "Like ❤️";
    button.addEventListener("click", () => {
      likeToy(toy);
    });

    card.appendChild(h2);
    card.appendChild(img);
    card.appendChild(p);
    card.appendChild(button);

    return card;
  }

  // Function to like a toy
  function likeToy(toy) {
    toy.likes++;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        likes: toy.likes
      })
    })
    .then(response => response.json())
    .then(updatedToy => {
      const toyCard = document.getElementById(updatedToy.id).parentNode;
      const p = toyCard.querySelector("p");
      p.textContent = `${updatedToy.likes} Likes`;
    })
    .catch(error => {
      console.error('Error liking toy:', error);
    });
  }

  // Function to toggle the add toy form visibility
  function toggleToyForm() {
    const toyFormContainer = document.querySelector(".container");
    toyFormContainer.style.display = (toyFormContainer.style.display === 'none') ? 'block' : 'none';
  }

  // Fetch and display all toys when the page loads
  fetchToys();
});
