<script lang="ts">
  import isMobile from "is-mobile";

  if (location.pathname === "/panel") {
    location.href = '/panel' + (isMobile() ? "/mobile" : "/desktop") + location.search;
  }
</script>

<div />
