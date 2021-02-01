import {Selector} from 'testcafe';

fixture `LoginPage`
  .page `https://login-test.plista.com/de/`;

/**
 * User directly clicks on "Login" button, without entering any data in the input field
 */
test ("Should display error texts, on directly clicking Login button", async t =>{

  await t.click('#login_button-login');

  const errorElements = await Selector('div > .form_error');
  await t.expect(errorElements.count).eql(3)
          .expect(errorElements.nth(0).innerText).eql("Please choose your user type.")
          .expect(errorElements.nth(1).innerText).eql("Please provide a valid email address.")
          .expect(errorElements.nth(2).innerText).eql("Please fill in your password.");

});

/**
 * User enters necessary details in email and password fields 
 */
test ("Should not display any error text, if necessary field are filled", async t =>{

  await t.click('#login_button-login')
        .click(Selector('label').withText('Publisher'));
          
  let errorElements = await Selector('div > .form_error');
  await t.expect(errorElements.count).eql(2);

  await t.typeText('#login_input-email', 'abc@gmail.com').typeText('#login_input-password', 'password');

  errorElements = await Selector('div > .form_error');
  await t.expect(errorElements.count).eql(1);
});

/**
 * User clicks on 'Create One' link, should open account creation page.
 */

test ("On click of 'Create One', should open Create an Self Service Account", async t =>{

  await t.click('#login_link-create-account');
          
  let createAccountHeader = await Selector('div > h3');
  await t.expect(createAccountHeader.innerText).eql('Create an Self Service Account');
});

/**
 * On click of language change toggle button to 'de', the basic fields should translate to German.  
 */
test ("On click of 'de' language change button, should check for translation of basic fields (Email, Password and Country label)", async t =>{

  await t.click(Selector('input').withAttribute('type', 'checkbox'));
          
  await t.expect(Selector('label').withAttribute('for', 'login_input-email').innerText).eql('E-Mail-Adresse');
  await t.expect(Selector('label').withAttribute('for', 'login_input-password').innerText).eql('Passwort');
  await t.expect(Selector('label').withAttribute('for', 'login_select-country').innerText).eql('Land ');
});

/**
 * On selecting a different langauge (like 'Italy'), the user types (Publisher & Advertiser) should disappear.
 */
test ("On selecting a different country (like Italy) in country select dropdown, should not display Publisher & Advertiser radio buttons", async t =>{

  const countrySelect = Selector('#login_select-country');
  const countryOption = countrySelect.find('option');

  await t.click(countrySelect)
        .click(countryOption.withText('Italy'))
        .expect(countrySelect.value).eql('it')

  const userType = Selector('div.user-types');

  await t.expect(userType.exists).notOk();
});
