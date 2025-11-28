export async function openLoginForm(page: any) {
    // Click the login button.
    await page.getByRole('button', { name: 'Login' }).click();
}

export async function fillLoginCredentials(page: any) {
    await page.getByRole('textbox', { name: 'Username' }).fill('admin');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin');
}

export async function logIn(page: any) {
    await openLoginForm(page);
    await fillLoginCredentials(page);
    await page.getByRole('button', { name: 'Submit' }).click();
}