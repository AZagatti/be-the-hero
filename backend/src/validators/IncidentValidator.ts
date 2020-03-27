import { celebrate, Segments, Joi } from "celebrate";

export default {
  index: celebrate({
    [Segments.QUERY]: Joi.object().keys({
      page: Joi.number()
    })
  }),
  store: celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required()
    }).unknown(),
    [Segments.BODY]: Joi.object().keys({
      title: Joi.string().required(),
      description: Joi.string().required(),
      value: Joi.number().required()
    })
  }),
  delete: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required()
    })
  })
};
