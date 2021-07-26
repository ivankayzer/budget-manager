import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function Validate(
  callback: (value: any, args: object) => boolean,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(propertyValue: any, args: ValidationArguments) {
          return callback(propertyValue, args.object);
        },
      },
    });
  };
}
