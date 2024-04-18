<script lang="ts">
  export let atEnd: boolean;
  export let message: string;
  export let onClickNext: (event: MouseEvent) => void;
</script>

<div class="container relative highlighted-bar">
  <p class="message">{@html message}</p>

  <button data-testid="next-button" on:click={onClickNext}>
    {atEnd ? "Done" : "Next"}
  </button>
</div>

<style>
  .container {
    padding: 24px;
  }
  .message {
    margin: 0 0 16px;
  }
</style>
