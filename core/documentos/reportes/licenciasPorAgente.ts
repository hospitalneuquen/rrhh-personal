import { Types } from "mongoose";
import * as aqp from "api-query-params";

import { DocumentoPDF } from "../documentos";
import { Agente } from "../../../modules/agentes/schemas/agente";

import * as utils from "../utils";
import config from "../../../confg";

export class DocumentoLicenciasPorAgente extends DocumentoPDF {
	templateName = "reportes/agentes-licencias.ejs";
	outputFilename = `${config.app.uploadFilesPath}/licenciasporarticulo.pdf`;

	getCSSFiles(){
        return this.isPrintable? ["css/reset.scss", "css/reports.scss", "css/print.scss"] : ["css/reports.scss"];
    }	

	async getContextData() {
		// Recuperamos todas las opciones para el reporte (filtros, orden, etc)
		let query = aqp(this.request.query, {
			casters: {
				documentoId: (val) => Types.ObjectId(val),
			},
			castParams: {
				_id: "documentoId",
				"situacionLaboral.cargo.sector._id": "documentoId",
				articulos: "documentoId",
			},
		});
		// Identificamos el campo por el cual agrupar. Si no se especifico agregamos
		// uno por defecto
		let groupField = utils.getQueryParam(query.filter, "$group");
		if (!groupField) groupField = "situacionLaboral.cargo.sector.nombre";
		const groupCondition = {
			_id: `$${groupField}`,
			agentes: { $push: "$$ROOT" },
		};

		// Filtros para las licencias
		let anios = utils.getQueryParam(query.filter, "anios");
		if (anios) {
			anios = anios.$in ? anios.$in : [anios];
		} else {
			anios = []; // TODO Raise error (Agregar todas las validaciones necesaras)
		}
		// Preparamos las opciones de filtrado sobre el agente. Removemos filtros no requeridos
		let filterCondition = utils.cleanFilters(query.filter);

		// Aggregation Framework Pipeline
		let pipeline: any = [
			{ $match: filterCondition || {} },
			{ $sort: query.sort || { apellido: 1 } },
			{
				$lookup: {
					from: "indicadoresAusentismo",
					let: { agente_id: "$_id" },
					pipeline: [
						{
							$match: {
								$expr: {
									$and: [
										{ $eq: ["$$agente_id", "$agente._id"] }, // Join con agente id
										{ $in: ["$vigencia", anios] },
									],
								},
							},
						},
						{ $sort: { vigencia: 1 } },
					],
					as: "ausentismo",
				},
			},
			{ $group: groupCondition },
			{ $sort: { _id: 1 } },
		];

		let gruposAgentes = await Agente.aggregate(pipeline);

		return {
			gruposAgente: gruposAgentes,
			anios: anios,
			srcImgLogo: this.headerLogo,
		};
    }

	getFilterField(filter, filterCondition) {
		let filterField;
		if (filter && filter[filterCondition]) {
			filterField = filter[filterCondition];
		}
		return filterField;
	}

	projectionToArray(extraFields) {
		let output = [];
		Object.keys(extraFields).forEach((field) => {
			output.push(field);
		});
		return output;
	}
}
