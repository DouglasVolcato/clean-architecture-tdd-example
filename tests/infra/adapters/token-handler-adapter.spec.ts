import { sign } from "jsonwebtoken";
import { makeUserEntity, throwError } from "../../test-helpers";
import { TokenHandlerAdapter } from "../../../src/infra/adapters/token-handler-adapter";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

type SutTypes = {
  sut: TokenHandlerAdapter;
};

const makeSut = (): SutTypes => {
  const sut = new TokenHandlerAdapter();
  return { sut };
};

describe("TokenHandlerAdapter", () => {
  it("Should call jwt library", () => {
    const { sut } = makeSut();
    sut.generateToken(makeUserEntity().id, "any_secret");

    expect(sign).toHaveBeenCalledTimes(1);
  });

  it("Should return generated token", () => {
    const { sut } = makeSut();
    (sign as jest.Mock).mockReturnValueOnce("generated_token");
    const generatedToken = sut.generateToken(makeUserEntity().id, "any_secret");

    expect(generatedToken).toBe("generated_token");
  });

  it("Should throw if jwt throws", () => {
    const { sut } = makeSut();
    (sign as jest.Mock).mockImplementationOnce(() => throwError());

    expect(() =>
      sut.generateToken(makeUserEntity().id, "any_secret")
    ).toThrow();
  });
});
