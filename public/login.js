const checkBlankInput = (value) => value === '';
  const registrationForm = document.querySelector('#regForm')
  const loginForm = document.querySelector('#loginForm')
  const initRegistrationForm = document.querySelector('#init-reg')
  const initLoginForm = document.querySelector('#init-login')

  initRegistrationForm.addEventListener('click', () => {
  loginForm.style.display = "none"
  registrationForm.style.display = "block"
  initRegistrationForm.style.display = "none"
  initLoginForm.style.display = "block"
    })

  initLoginForm.addEventListener('click', () => {
  loginForm.style.display = "block"
  registrationForm.style.display = "none"
  initRegistrationForm.style.display = "block"
  initLoginForm.style.display = "none"
  })
// const loadLogin = () => {

//   }

  // registrationButton.addEventListener('click', () => {
  //   const getData = [...document.querySelectorAll('.registration')];
  //   const formData = getData.map((x) => x.value);
  //   if (formData.some(checkBlankInput)) {
  //     alert('Please fill out all fields!');
  //     return;
  //   }
  //   const data = {
  //     email: formData[0],
  //     username: formData[1],
  //     password: formData[2],
  //   };
  //   axios
  //     .post('/register', data)
  //     .then((response) => {
  //       if (response.data === 'emailExists') {
  //         alert('That email already exists!');
  //       }
  //       else if (response.data === 'userCreated') {
  //         renderGame();
  //       }
  //     });
  // });
  // loginButton.addEventListener('click', () => {
  //   const getData = [...document.querySelectorAll('.login')];
  //   const formData = getData.map((x) => x.value);
  //   if (formData.some(checkBlankInput)) {
  //     alert('Please fill out all fields!');
  //     return;
  //   }
  //   const data = {
  //     email: formData[0],
  //     password: formData[1],
  //   };
  //   axios
  //     .post('/login', data)
  //     .then((response) => {
  //       if (response.data === 'invalidLogin') {
  //         alert('Please check your details!');
  //       }
  //       else if (response.data === 'loggedIn') {
  //         renderGame();
  //       }
  //     });
  // });