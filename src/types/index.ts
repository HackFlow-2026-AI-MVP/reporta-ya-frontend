export type Priority='Bajo'|'Medio'|'Alto';
export type EvidenceType={id:string;name:string;description:string;icon:string};
export type Evidence={id:string;typeId:string;typeName:string;incidentDate:string;description:string;personInvolved:string|null;priority:Priority;fileName?:string|null};
export type Case={id:string;caseNumber:string;title:string;createdAt:string;evidences?:Evidence[]};
export type Summary={caseNumber:string;count:number;timeline:Array<{date:string;description:string;priority:Priority;typeName:string}>;recommendations:string[]};
