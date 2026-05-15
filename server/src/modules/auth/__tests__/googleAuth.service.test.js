import assert from "node:assert/strict";
import test from "node:test";
import { isLocalPasswordAccount } from "../googleAuthPolicy.js";

test("treats default provider as local password account", () => {
  assert.equal(isLocalPasswordAccount({ provider: undefined }), true);
});

test("allows sign-in when provider is google", () => {
  assert.equal(isLocalPasswordAccount({ provider: "google" }), false);
});

test("blocks sign-in for explicit local provider", () => {
  assert.equal(isLocalPasswordAccount({ provider: "local", password: "hashed" }), true);
});

test("blocks tutor/recruiter local registrations from google takeover", () => {
  assert.equal(isLocalPasswordAccount({ provider: "local", role: "recruiter" }), true);
});
