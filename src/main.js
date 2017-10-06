(function() {
  var projectElements = document.getElementsByClassName('project');
  [].forEach.call(projectElements, function(element) {
    element.addEventListener('click', function(event) {
      if (!element.classList.contains('active')) {
        element.classList.add('active');
        element.style.height = element.scrollHeight + 'px';
      }
    });
  });

  var closeElements = document.getElementsByClassName('close-details');
  [].forEach.call(closeElements, function(element) {
    element.addEventListener('click', function(event) {
      event.preventDefault();
      event.stopPropagation();

      var topParentElement = element.parentElement.parentElement;
      if (topParentElement.classList.contains('active')) {
        topParentElement.classList.remove('active');
        topParentElement.style.height = '130px';
      }
    });
  });

  document.getElementById('geocities-self-destruct').addEventListener('click', function(event) {
    document.body.classList.add('geocities');
    [
      'counter.gif',
      'dancingbaby.gif',
      'doggy.gif',
      'emailme.gif',
      'flamingline.gif',
      'mchammer.gif',
      'new.gif',
      'sendmail.gif',
      'smrb.gif',
    ].forEach(function(filename) {
      var image = new Image();
      image.src = 'assets/images/' + filename;
      image.style.display = 'block';
      image.style['z-index'] = 10;
      image.style.position = 'absolute';
      image.style.top = Math.floor(Math.random() * document.body.scrollHeight) + 'px';
      image.style.left = Math.floor(Math.random() * window.innerWidth / 3) + 'px';

      document.body.appendChild(image);
    });
  });

  var emailElement = document.getElementById('email-div');
  var emailAddress = [
    'mrkoreye',
    '@',
    'gmail',
    '.',
    'com'
  ].join('');
  emailElement.innerText = emailAddress;
})();