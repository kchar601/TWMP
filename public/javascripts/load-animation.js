
  const loader = document.querySelector('.loader');

  function showLoader() {
    if (loader) {
      loader.classList.add('visible');
    } else {
      console.error('Loader element not found!');
    }
  }

  function hideLoader() {
    if (loader) {
      loader.classList.remove('visible');
    }
  }
