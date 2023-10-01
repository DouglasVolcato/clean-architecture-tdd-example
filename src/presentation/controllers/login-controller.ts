import {
  LoginDtoType,
  LoginServiceInterface,
  TokenDtoType,
} from "../../domain/abstract";
import { Controller } from "./controller";
import {
  ControllerInterface,
  ControllerOutputType,
  ValidatorCompositeInterface,
  ValidatorInterface,
} from "../../presentation/abstract";
import { ValidatorBuilder } from "../../presentation/validators";
import { badRequest, ok } from "../../presentation/helpers";

export class LoginController extends Controller implements ControllerInterface {
  private readonly loginService: LoginServiceInterface;

  public constructor(
    validatorComposite: ValidatorCompositeInterface,
    loginService: LoginServiceInterface
  ) {
    super(validatorComposite);
    this.loginService = loginService;
  }

  protected async perform(
    request: LoginDtoType
  ): Promise<ControllerOutputType<TokenDtoType | Error>> {
    const token = await this.loginService.execute(request);
    if (token instanceof Error) return badRequest(token);
    return ok({ token });
  }

  protected buildValidators(): ValidatorInterface[] {
    return [
      new ValidatorBuilder().of("email").isEmail(),
      new ValidatorBuilder().of("password").isRequired(),
    ];
  }
}
