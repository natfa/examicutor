import Joi from 'joi';

export const BaseSchema = Joi.object({
    createdAt: Joi
        .date()
        .optional(),

    updatedAt: Joi
        .date()
        .optional(),
});