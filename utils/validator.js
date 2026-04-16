const Joi = require('joi');

//Schema for /auth/register
const registerSchema = Joi.object({
    fullname: Joi.string().required(),
    email: Joi.string().email().required(),
    pwd: Joi.string().required(),
    userType: Joi.string().regex(/Oncologo|Corriere|Analista/).required()
});

//Schema for /auth/login
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    pwd: Joi.string().required()
});

//Schema for /patient
const patientSchema = Joi.object({
	fiscalCode: Joi.string().required(),
	isForeign: Joi.boolean().required(),
	name: Joi.string().required(),
	surname: Joi.string().required(),
	birthDate: Joi.date().required(),
	initials: Joi.string().required(),
	gender: Joi.string().regex(/M|F|Altro/).required(),
	ethnicOrigin: Joi.string().regex(/Caucasico|Africano|Asiatico|Altro/).required(),
	otherEthnicOrigin: Joi.string().allow(""),
	residenceRegion: Joi.string().required(),
	residenceCity: Joi.string().required(),
	residenceProvince: Joi.string().required(),
	cap: Joi.string().required(),
	address: Joi.string().required(),
	civicNumber: Joi.number().required(),
	phone: Joi.string().required(),
	privacyAndConditions: Joi.boolean().required(),
	privacyPersonalData: Joi.boolean().required(),
	diagnosis: Joi.string().regex(/OC|BC|Altro/).required(),
	neoplasia: Joi.string().regex(/Epitelioma|Adenocarcinoma|Altro/).required(),
	familiarity: Joi.number().required(),
	brcaSomaticTest: Joi.boolean().required(),
	mutationResult: Joi.string().regex(/Positive|Negative|Indeterminate/).required(),
	histology: Joi.string().required(),
	otherHistology: Joi.string().allow(""),
	isoTypeOtherDetails: Joi.string().allow(""),
	hasReceivedSystemicTreatment: Joi.boolean().required(),
	platinumSensitive: Joi.boolean().allow(null),
	oncologistNotes: Joi.string().allow(""),
	allergies: Joi.string().allow(""),
	previousTreatments: Joi.string().allow("")
});

//Schema for /sample
const sampleSchema = Joi.object({
    analystWorkgroup: Joi.number().required(),
    typeofBiologicalMaterial: Joi.string().regex(/Tissue|Blood|Other/).required(),
    exhaustedBiologicalMaterial: Joi.boolean().required(),
    histologicalNumber: Joi.string(),
    tissuePreservationMode: Joi.string().regex(/Formalin|Frozen|Paraffin/).allow(null),
    tissueSamplingMode: Joi.string().regex(/Biopsy|Surgery|Cytology/).allow(null),
    otherTissueSamplingMode: Joi.string().allow(null),
    biopsyType: Joi.string().regex(/Core|FineNeedle|Incisional|Excisional/).allow(null),
    tissueProvenance: Joi.string().allow(null),
    metaStaticSite: Joi.string().allow(null),
    pctTumorCells: Joi.number().min(0).max(100).required(), /*% cellule tumorali*/
    ageOfSample: Joi.number().min(0).required(),
    pathologistNotes: Joi.string().allow(""),
    patient: Joi.string().required(),
    oncologiWorkgroup: Joi.number().required()
})

//Schema for sample/:id/status
const sampleStatusSchema = Joi.object({
	status: Joi.string().regex(/unanalyzed|analyzing|completed/).required()
})

const shipSampleSchema = Joi.object({
	courier: Joi.number().min(0).required(),
	sample: Joi.number().min(0).required(),
	expectedTakenDate: Joi.date().required()
})

//Schema for shipment/:id/status
const shipmentStatusSchema = Joi.object({
	status: Joi.string().regex(/received|taken|in transit|arrived/).required()
})

//Schema for user/:id/workgroup
const userWorkgroupSchema = Joi.object({
	workgroup: Joi.number().required()
})

const refertoSchema = Joi.object({
	referto: Joi.object({
		isLabelEligible: Joi.boolean().required(),
		notElegibleReason: Joi.string().allow(""),
		otherNotElegibleReason: Joi.string().allow(""),
		isSampleElegible:Joi.boolean().required(),
		reasonSampleNotElegible: Joi.string().allow(""),
		sample: Joi.number().required()
	}).required(),
	result: Joi.object({
		dnaQuality: Joi.string().regex(/Low|Medium|High/).required(),
		technique: Joi.string().regex(/SOPHiA DDM|NGS|Amoy Dx|Thermo Fisher|Illumina/).required(),
		genomicInstabilityStatus: Joi.string().regex(/Low|Medium|High/).required(),
		lossOfHeterozygosityPercentage:Joi.number().required(),
		genomicInstabilityMetric: Joi.string().required(),
		hrdStatus: Joi.string().regex(/Positivo+|Positivo|Indeterminabile|HRP/).required(),
		hrdScore: Joi.number().required(),
		genomicIntegrityStatus: Joi.string().regex(/Good|Moderate|Poor/).required(),
		brcaMutationStatus: Joi.string().regex(/WildType|Mutato|VUS|NonValutabile/).required(),
		genotypeBrca: Joi.string().regex(/Omozigote|Eterozigote|AssenzaVarianti/).required(),
		variantStatus: Joi.string().regex(/Somatica|Germinale|GermlineSomatica/).required(),
		geneMutation: Joi.string().allow("").required(),
		geneOther: Joi.string().allow("").required(),
		exon: Joi.string().required(),
		intron: Joi.string().required(),
		nucleotideSubstitution: Joi.string().required(),
		aminoacidSubstitution: Joi.string().required(),
		reportingNotes: Joi.string().allow(""),
		reportingNotesBRCA: Joi.string().allow(""),
		refertingNotesHrd: Joi.string().allow(""),
		technicalNotes: Joi.string().allow(""),
		notesAnalysisCenter: Joi.string().allow("")
	}).optional().allow(null)
})

module.exports = {
    registerSchema,
    loginSchema,
    patientSchema,
    sampleSchema,
	sampleStatusSchema,
	shipSampleSchema,
	shipmentStatusSchema,
	userWorkgroupSchema,
	refertoSchema
}

