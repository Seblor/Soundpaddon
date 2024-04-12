<script lang="ts">
  import isMobile from "is-mobile";

  if (window.location.pathname === "/panel") {
    window.location.href = '/panel' + (isMobile() ? "/mobile" : "/desktop") + location.search;
  }
</script>

<div />
