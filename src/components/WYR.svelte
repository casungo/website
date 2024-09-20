<script>
  import { onMount } from 'svelte';

  let normalQuestions = [
    { id: 1, option1: "Be able to fly", option2: "Be invisible" },
    { id: 2, option1: "Read minds", option2: "See the future" },
    { id: 3, option1: "Always be 10 minutes late", option2: "Always be 20 minutes early" },
    // Add more normal questions here
  ];

  let strangeQuestions = [
    { id: 1, option1: "Have fingers as long as your legs", option2: "Have legs as long as your fingers" },
    { id: 2, option1: "Speak all languages but lose the ability to read", option2: "Read all languages but lose the ability to speak" },
    { id: 3, option1: "Have to sing everything you say", option2: "Have to dance everywhere you go" },
    // Add more strange questions here
  ];

  let currentQuestionIndex = 0;
  let currentQuestions = normalQuestions;
  let currentQuestion = currentQuestions[currentQuestionIndex];

  function nextQuestion() {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      currentQuestionIndex++;
      currentQuestion = currentQuestions[currentQuestionIndex];
    } else {
      // Game over logic here
      alert("Game Over! Thanks for playing!");
      currentQuestionIndex = 0;
      currentQuestion = currentQuestions[currentQuestionIndex];
    }
  }

  function switchCategory(category) {
    currentQuestions = category === 'normal' ? normalQuestions : strangeQuestions;
    currentQuestionIndex = 0;
    currentQuestion = currentQuestions[currentQuestionIndex];
  }

  onMount(() => {
    currentQuestion = currentQuestions[currentQuestionIndex];
  });
</script>

<div class="bg-base-300 p-4 rounded-box">
  <div class="tabs tabs-boxed mb-4">
    <button class="tab" class:tab-active={currentQuestions === normalQuestions} on:click={() => switchCategory('normal')}>Normal</button> 
    <button class="tab" class:tab-active={currentQuestions === strangeQuestions} on:click={() => switchCategory('strange')}>Strange</button>
  </div>

  <h2 class="text-xl font-bold mb-4">Would You Rather...</h2>
  
  {#if currentQuestion}
    <div class="flex flex-col space-y-4">
      <button 
        class="btn btn-primary"
        on:click={nextQuestion}
      >
        {currentQuestion.option1}
      </button>
      <button 
        class="btn btn-secondary"
        on:click={nextQuestion}
      >
        {currentQuestion.option2}
      </button>
    </div>
  {:else}
    <p>No more questions!</p>
  {/if}
</div>