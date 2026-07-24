/**
 * ==========================================================================================================
 * ATHENA X - CANONICAL LAW & ECCLESIASTICAL KNOWLEDGE INTELLIGENCE ENGINE
 * Subsystem: Ecclesiastical Council Intelligence Engine
 * 
 * Directive: 211 (Canonical Law & Ecclesiastical Knowledge Engine)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';
import { EcclesiasticalCanon, Jurisdiction } from './canon-types';

export interface CouncilParticipant {
  readonly participantId: UUID;
  readonly name: string;
  readonly arabicName: string;
  readonly seeName: string; // e.g. 'Alexandria', 'Rome', 'Cordoba'
  readonly role: 'Presidium' | 'Delegate' | 'Theologian' | 'Imperial Representative';
}

export interface CouncilRecord {
  readonly councilId: UUID;
  readonly name: string;
  readonly arabicName: string;
  readonly yearCE: number;
  readonly location: string;
  readonly convener: string; // e.g. 'Emperor Constantine I', 'Emperor Theodosius II'
  readonly keyDogma: string;
  readonly arabicKeyDogma: string;
  readonly canonsIssuedCount: number;
  readonly participants: ReadonlyArray<CouncilParticipant>;
  readonly primaryAnathemas: ReadonlyArray<string>;
}

export interface CouncilTimelineEvent {
  readonly eventYearCE: number;
  readonly councilName: string;
  readonly summary: string;
  readonly arabicSummary: string;
  readonly impactLevel: 'Critical Dogmatic' | 'Administrative Canon' | 'Local Synod';
}

export class CouncilIntelligenceEngine {
  private councils: Map<UUID, CouncilRecord> = new Map();

  constructor() {
    this.seedMajorEcumenicalCouncils();
  }

  public getCouncilByName(name: string): Result<CouncilRecord, Error> {
    const match = Array.from(this.councils.values()).find(
      (c) => c.name.toLowerCase().includes(name.toLowerCase()) || c.arabicName.includes(name)
    );
    if (!match) {
      return Result.fail(new Error(`Ecclesiastical Council '${name}' not found in registry.`));
    }
    return Result.ok(match);
  }

  public generateCouncilTimeline(): ReadonlyArray<CouncilTimelineEvent> {
    const events: CouncilTimelineEvent[] = [];
    const sorted = Array.from(this.councils.values()).sort((a, b) => a.yearCE - b.yearCE);

    sorted.forEach((c) => {
      events.push({
        eventYearCE: c.yearCE,
        councilName: c.name,
        summary: `${c.name} (${c.yearCE} CE): ${c.keyDogma}`,
        arabicSummary: `${c.arabicName} (عام ${c.yearCE}م): ${c.arabicKeyDogma}`,
        impactLevel: 'Critical Dogmatic',
      });
    });

    return events;
  }

  public extractTheologicalContext(councilName: string): Result<string, Error> {
    const councilRes = this.getCouncilByName(councilName);
    if (councilRes.isFailure) return Result.fail(councilRes.getError());

    const c = councilRes.getValue();
    const contextStr = `السياق اللاهوتي والتاريخي لـ [${c.arabicName} - ${c.yearCE}م]:
- الداعي للمجمع: ${c.convener}
- قضية المجمع اللاهوتية الكبرى: ${c.arabicKeyDogma}
- عدد القوانين التشريعية الصادرة: ${c.canonsIssuedCount} قانوناً.
- أهم المشاركين والشواهد: ${c.participants.map((p) => `${p.arabicName} (${p.seeName})`).join('، ')}.
- الحرومات المقررة: ${c.primaryAnathemas.join('؛ ')}.`;

    return Result.ok(contextStr);
  }

  private seedMajorEcumenicalCouncils(): void {
    const nicaea: CouncilRecord = {
      councilId: crypto.randomUUID(),
      name: 'First Council of Nicaea',
      arabicName: 'مجمع نيقية المسكوني الأول',
      yearCE: 325,
      location: 'Nicaea (Bithynia)',
      convener: 'Emperor Constantine I',
      keyDogma: 'Full Divinity of Christ (Homoousios with the Father) against Arianism',
      arabicKeyDogma: 'إقرار قانون الإيمان وإثبات ألوهية الابن ومساواته للآب في جوهر واحد (مساوٍ في الجوهر - Homoousios) ودحض الآريوسية.',
      canonsIssuedCount: 20,
      participants: [
        {
          participantId: crypto.randomUUID(),
          name: 'St. Alexander of Alexandria',
          arabicName: 'القديس ألكسندروس بابا الإسكندرية',
          seeName: 'Alexandria',
          role: 'Presidium',
        },
        {
          participantId: crypto.randomUUID(),
          name: 'St. Athanasius the Apostolic',
          arabicName: 'القديس أثناسيوس الرسولي (شماس الإسكندرية)',
          seeName: 'Alexandria',
          role: 'Theologian',
        },
        {
          participantId: crypto.randomUUID(),
          name: 'Hosius of Cordoba',
          arabicName: 'هوسيوس أسقف قرطبة',
          seeName: 'Cordoba',
          role: 'Presidium',
        },
      ],
      primaryAnathemas: [
        'Anathema on those who say "There was a time when He was not"',
        'حرم كل من يقول "كان وقت لم يكن فيه الابن" أو "إنه خُلِق من العدم"',
      ],
    };

    const constantinople: CouncilRecord = {
      councilId: crypto.randomUUID(),
      name: 'First Council of Constantinople',
      arabicName: 'مجمع القسطنطينية المسكوني الأول',
      yearCE: 381,
      location: 'Constantinople',
      convener: 'Emperor Theodosius I',
      keyDogma: 'Full Divinity of the Holy Spirit against Pneumatomachi (Macedonians)',
      arabicKeyDogma: 'إكمال قانون الإيمان النيقاوي وإثبات ألوهية الروح القدس (الرب المحيي المنبثق من الآب) ودحض مقدونيس.',
      canonsIssuedCount: 7,
      participants: [
        {
          participantId: crypto.randomUUID(),
          name: 'St. Gregory Nazianzen',
          arabicName: 'القديس غريغوريوس النزيانزي (اللاهوتي)',
          seeName: 'Constantinople',
          role: 'Presidium',
        },
        {
          participantId: crypto.randomUUID(),
          name: 'St. Cyril of Jerusalem',
          arabicName: 'القديس كيرلس أورشليم',
          seeName: 'Jerusalem',
          role: 'Delegate',
        },
      ],
      primaryAnathemas: ['Anathema on Pneumatomachi (Deniers of the Holy Spirit Divinity)'],
    };

    const ephesus: CouncilRecord = {
      councilId: crypto.randomUUID(),
      name: 'Council of Ephesus',
      arabicName: 'مجمع أفسس المسكوني',
      yearCE: 431,
      location: 'Ephesus',
      convener: 'Emperor Theodosius II',
      keyDogma: 'Hypostatic Union in Christ and Mary as Theotokos (God-Bearer)',
      arabicKeyDogma: 'تأكيد الاتحاد الأقنومي لطبيعة المسيح وتأكيد لقب "والدة الإله" (ثيوتوكوس Theotokos) للست العذراء ودحض نسطور.',
      canonsIssuedCount: 8,
      participants: [
        {
          participantId: crypto.randomUUID(),
          name: 'St. Cyril of Alexandria',
          arabicName: 'القديس كيرلس الكبير عمود الدين (بابا الإسكندرية)',
          seeName: 'Alexandria',
          role: 'Presidium',
        },
      ],
      primaryAnathemas: [
        'The 12 Anathemas of St. Cyril against Nestorius',
        'الحرومات الإثنا عشر للقديس كيرلس الكبير ضد نسطور',
      ],
    };

    const chalcedon: CouncilRecord = {
      councilId: crypto.randomUUID(),
      name: 'Council of Chalcedon',
      arabicName: 'مجمع خلكيدونية',
      yearCE: 451,
      location: 'Chalcedon',
      convener: 'Emperor Marcian',
      keyDogma: 'Two Natures Definition and Ecclesiastical Jurisdiction Disputes',
      arabicKeyDogma: 'تحديد الطبيعتين الكنسي وتحديد صلاحيات كرسي القسطنطينية (القانون 28).',
      canonsIssuedCount: 30,
      participants: [
        {
          participantId: crypto.randomUUID(),
          name: 'Pope Leo I of Rome (Delegates)',
          arabicName: 'مندوبو الأسقف ليون الأول أسقف روما',
          seeName: 'Rome',
          role: 'Delegate',
        },
        {
          participantId: crypto.randomUUID(),
          name: 'St. Dioscorus of Alexandria',
          arabicName: 'القديس ديسقوروس بطل الأرثوذكسية (بابا الإسكندرية)',
          seeName: 'Alexandria',
          role: 'Presidium',
        },
      ],
      primaryAnathemas: ['Anathema on Eutyches (Monophysitism defined as confusion of natures)'],
    };

    this.councils.set(nicaea.councilId, nicaea);
    this.councils.set(constantinople.councilId, constantinople);
    this.councils.set(ephesus.councilId, ephesus);
    this.councils.set(chalcedon.councilId, chalcedon);
  }
}
