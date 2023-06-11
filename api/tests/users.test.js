const mongoose = require("mongoose");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const userService = require("../services/userService");
const { config } = require("../config/settings");

describe("User Service", () => {
  // Create a test user
  const testUser = {
    name: "Test User",
    image: "test.jpg",
    email: "test@example.com",
    password: "test123",
  };

  // Connect to the test database before running the tests
  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/testdb");
  });

  beforeEach(async () => {
    // Clear the users collection before each test
    await User.deleteMany();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should register a new user", async () => {
    // Call the registerUser function with the test user data
    const registeredUser = await userService.registerUser(
      testUser.name,
      testUser.image,
      testUser.email,
      testUser.password
    );

    // Retrieve the user from the database
    const user = await User.findOne({ email: testUser.email });

    // Assert that the user exists in the database
    expect(user).toBeTruthy();

    // Assert that the returned registeredUser object matches the expected structure
    expect(registeredUser).toEqual({
      _id: user.id,
      name: user.name,
      image: user.image,
      email: user.email,
      token: expect.any(String),
    });

    // Assert that the password is hashed in the database
    expect(user.password).not.toBe(testUser.password);

    // Assert that the generated token is valid
    const decodedToken = jwt.verify(registeredUser.token, config.jwtSecret);
    expect(decodedToken.id).toBe(user.id);
  });

  it("should throw an error when not all fields are provided", async () => {
    // Call the registerUser function without providing all the required fields
    await expect(
      userService.registerUser(testUser.name, testUser.image, testUser.email)
    ).rejects.toThrow("Please add all fields");
  });

  it("should throw an error when the user already exists", async () => {
    // Create a user with the same email in the database
    await User.create(testUser);

    // Call the registerUser function with the same email
    await expect(
      userService.registerUser(
        testUser.name,
        testUser.image,
        testUser.email,
        testUser.password
      )
    ).rejects.toThrow("User already exists");
  });

  // Test cases for login
  it("should login a user and return user details with token", async () => {
    // Create a test user
    const userData = {
      name: "John Doe",
      image: "avatar.jpg",
      email: "john@example.com",
      password: "password",
    };
    const newUser = await userService.registerUser(
      userData.name,
      userData.image,
      userData.email,
      userData.password
    );

    // Login the user
    const loggedInUser = await userService.loginUser(
      userData.email,
      userData.password
    );

    // Assert the returned user details
    expect(loggedInUser).toEqual({
      _id: newUser._id,
      name: newUser.name,
      image: newUser.image,
      email: newUser.email,
      token: expect.any(String),
    });
  });

  it("should throw an error for invalid credentials", async () => {
    // Attempt to login with invalid credentials
    const invalidEmail = "invalid@example.com";
    const invalidPassword = "invalidpassword";

    // Assert that an error is thrown
    await expect(
      userService.loginUser(invalidEmail, invalidPassword)
    ).rejects.toThrow("Invalid credentials");
  });

  it("should throw an error when user does not exist", async () => {
    // Attempt to login with non-existing user
    const nonExistingEmail = "nonexisting@example.com";
    const password = "password";

    // Assert that an error is thrown
    await expect(
      userService.loginUser(nonExistingEmail, password)
    ).rejects.toThrow("Invalid credentials");
  });
});
