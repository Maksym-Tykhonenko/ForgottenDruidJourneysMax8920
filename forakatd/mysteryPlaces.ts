// Catalogue of mysterious locations explored throughout the journey.
// Each entry carries its artwork, a short teaser, a long-form article
// (three paragraphs) and world-map coordinates used by the atlas view.

export interface MysteryPlace {
  id: number;
  name: string;
  region: string;
  shortDescription: string;
  fullDescription: string;
  image: any;
  lat: number;
  lng: number;
}

const places: MysteryPlace[] = [
  {
    id: 1,
    name: 'Shadow Stone',
    region: 'Cumbria, Britain',
    shortDescription:
      'An ancient monolith where unexplained shadows have been reported for generations.',
    fullDescription:
      'At the center of a remote plain stands a massive stone known as Shadow Stone. For centuries, local communities avoided the site after sunset. Many believed the monument attracted unseen forces. Some legends even connect it to a forgotten order of mystics.\n\nThe most mysterious reports involve moving shadows. Witnesses claimed to see dark figures circling the stone despite the absence of moonlight or nearby light sources. No physical explanation has ever been confirmed. Similar accounts have appeared repeatedly throughout local history.\n\nResearchers have visited the site many times in search of answers. Some reported equipment malfunctions during nighttime observations. Others found nothing unusual at all. This contradiction has only deepened the mystery surrounding Shadow Stone.',
    image: require('../irdeimgs/ShadowStone.png'),
    lat: 54.6,
    lng: -3.0,
  },
  {
    id: 2,
    name: 'Whisper Forest',
    region: 'Thuringia, Germany',
    shortDescription:
      'A woodland where travelers claim to hear voices carried by the wind.',
    fullDescription:
      'Whisper Forest is known for its unusual atmosphere and unsettling silence. According to local stories, strange voices can sometimes be heard between the trees. The sounds often resemble distant conversations. No source has ever been identified.\n\nMany visitors describe hearing their own names whispered from unseen locations. The phenomenon has inspired countless legends and ghost stories. Some believe the forest preserves echoes from the past. Others think the sounds are caused by unusual natural conditions.\n\nSeveral investigations have attempted to record the whispers. Audio equipment occasionally captured faint sounds that could not be clearly explained. However, results have remained inconsistent. The mystery continues to attract curious explorers.',
    image: require('../irdeimgs/WhisperForest.png'),
    lat: 50.9,
    lng: 11.0,
  },
  {
    id: 3,
    name: 'Moon Gate',
    region: 'Honshu, Japan',
    shortDescription:
      'A stone arch linked to stories of disappearances and strange lights.',
    fullDescription:
      'Moon Gate is an ancient archway standing alone on a rocky plateau. Its origins remain unknown despite numerous archaeological studies. Local legends claim it was once used as a ceremonial passage. The structure has become a symbol of mystery in the region.\n\nWitnesses have reported unusual lights appearing near the arch after dark. These glowing shapes often vanish before they can be approached. Some stories describe travelers who became disoriented after passing through the gate. Others speak of missing time and unusual dreams.\n\nResearchers have proposed many theories about the phenomenon. Some point to rare atmospheric effects. Others suggest psychological influences created by the isolated environment. No explanation has gained universal acceptance.',
    image: require('../irdeimgs/MoonGate.png'),
    lat: 35.4,
    lng: 138.7,
  },
  {
    id: 4,
    name: 'Silent Lake',
    region: 'Telemark, Norway',
    shortDescription:
      'A dark lake associated with unexplained sounds beneath the water.',
    fullDescription:
      'Silent Lake appears calm and peaceful during the day. However, it is famous for strange noises reported after sunset. Witnesses describe deep echoes and distant tones rising from beneath the surface. The source remains unknown.\n\nOld legends claim an ancient settlement once stood where the lake exists today. According to folklore, its ruins still rest beneath the water. Some believe the sounds are connected to these forgotten structures. Others see them as warnings from unseen forces.\n\nSeveral underwater surveys have been conducted over the years. Although unusual formations were discovered, no evidence explained the mysterious sounds. The phenomenon continues to inspire speculation. Silent Lake remains one of the region’s greatest mysteries.',
    image: require('../irdeimgs/SilentLake.png'),
    lat: 59.5,
    lng: 8.5,
  },
  {
    id: 5,
    name: 'Crystal Cavern',
    region: 'Altiplano, Bolivia',
    shortDescription:
      'A concealed cave where glowing formations appear without explanation.',
    fullDescription:
      'Deep beneath a mountain range lies Crystal Cavern. The cave is famous for unusual mineral formations that seem to glow in darkness. Their soft light has inspired myths for generations. Many believe the cavern possesses extraordinary properties.\n\nStories tell of travelers who became lost while following the glowing paths. Some reported seeing strange reflections moving independently from their own actions. Others described feelings of being watched. These accounts have become part of local folklore.\n\nScientists have studied the crystals extensively. While some natural explanations exist, not every reported phenomenon can be confirmed. Debate continues among researchers and visitors alike. The cavern remains a place of fascination and mystery.',
    image: require('../irdeimgs/CrystalCavern.png'),
    lat: -16.5,
    lng: -68.1,
  },
  {
    id: 6,
    name: 'Raven Peak',
    region: 'Highlands, Iceland',
    shortDescription:
      'A mountain summit where dark birds gather under unusual circumstances.',
    fullDescription:
      'Raven Peak rises above the surrounding valleys like a dark spire. For centuries, flocks of ravens have gathered there in numbers far greater than expected. Local legends describe the birds as guardians of ancient secrets. The summit has become a symbol of mystery and superstition.\n\nWitnesses have reported strange behavior among the birds. Large groups sometimes circle silently for hours before disappearing at once. Others claim the ravens seem to react to events before they occur. These stories have fueled countless theories.\n\nResearchers have studied migration patterns in the area. While some explanations seem plausible, many observations remain unusual. The phenomenon continues to attract attention from both scientists and storytellers. Raven Peak remains one of the region’s most enigmatic landmarks.',
    image: require('../irdeimgs/RavenPeak.png'),
    lat: 64.1,
    lng: -19.0,
  },
  {
    id: 7,
    name: 'Phantom Tower',
    region: 'Lazio, Italy',
    shortDescription:
      'A ruined tower said to appear differently to every visitor.',
    fullDescription:
      'Phantom Tower stands on a lonely hillside overlooking vast grasslands. Historical records mention the structure for hundreds of years. However, descriptions of the tower often conflict with one another. Some accounts even disagree about its size and shape.\n\nVisitors frequently report unusual experiences near the ruins. Certain travelers claim they discovered rooms that later could not be found again. Others describe hearing footsteps despite being completely alone. These reports have helped build the tower’s mysterious reputation.\n\nAttempts to document the site have produced inconsistent results. Photographs taken from similar locations sometimes appear surprisingly different. No convincing explanation has emerged. Phantom Tower continues to inspire speculation and folklore.',
    image: require('../irdeimgs/PhantomTower.png'),
    lat: 41.9,
    lng: 12.6,
  },
  {
    id: 8,
    name: 'Emerald Hollow',
    region: 'South Island, New Zealand',
    shortDescription:
      'A concealed valley connected to stories of strange lights and lost travelers.',
    fullDescription:
      'Emerald Hollow is a secluded valley surrounded by steep cliffs. The area is famous for glowing green lights seen at night. Legends claim these lights guide visitors toward concealed knowledge. Others warn that following them can lead to danger.\n\nMany travelers have reported becoming disoriented within the valley. Some believed they wandered for hours despite covering only short distances. Others described unusual feelings of calm and detachment. These experiences have become central to the valley’s mythology.\n\nScientific investigations have suggested several natural explanations. Yet none fully account for every report. The glowing lights continue to appear unpredictably. Emerald Hollow remains a place of unanswered questions.',
    image: require('../irdeimgs/EmeraldHollow.png'),
    lat: -44.7,
    lng: 168.1,
  },
  {
    id: 9,
    name: 'Frost Circle',
    region: 'Lapland, Finland',
    shortDescription:
      'A mysterious ring where ice forms regardless of the season.',
    fullDescription:
      'Concealed within a remote field lies Frost Circle. The site is known for patches of ice that sometimes appear during warm weather. Local folklore describes it as a meeting place for ancient spirits. The unusual phenomenon has puzzled observers for generations.\n\nWitnesses often report sudden drops in temperature near the circle. Some describe seeing frost patterns emerge within minutes. Others claim electronic devices behave strangely nearby. These stories have contributed to the site’s growing legend.\n\nResearchers continue to monitor environmental conditions at the location. While rare weather effects may play a role, many observations remain difficult to explain. The mystery persists year after year. Frost Circle remains one of the region’s most unusual sites.',
    image: require('../irdeimgs/FrostCircle.png'),
    lat: 67.4,
    lng: 26.6,
  },
  {
    id: 10,
    name: 'Concealed Monastery',
    region: 'Thessaly, Greece',
    shortDescription:
      'An abandoned sanctuary surrounded by unexplained stories and legends.',
    fullDescription:
      'Concealed Monastery sits deep within a mountainous wilderness. Little is known about the people who once lived there. Ancient records mention the site only briefly. Much of its history has been lost to time.\n\nVisitors often report hearing bells despite finding no functioning bell towers. Others describe seeing lights moving through empty corridors. Such accounts have fueled rumors about the monastery’s past. Some believe it still holds forgotten secrets.\n\nArchaeological studies have uncovered artifacts but few answers. Every discovery seems to generate new questions. The mystery surrounding the site continues to grow. Concealed Monastery remains a source of fascination for explorers and historians alike.',
    image: require('../irdeimgs/HiddenMonastery.png'),
    lat: 39.7,
    lng: 21.6,
  },
  {
    id: 11,
    name: 'Echo Canyon',
    region: 'Arizona, United States',
    shortDescription:
      'A canyon where voices are said to return with unexpected replies.',
    fullDescription:
      'Echo Canyon is famous for its remarkable acoustics. For centuries, travelers have tested the canyon by calling into its depths. While echoes are expected, some reports describe responses that sound different from the original words. These stories have become part of local folklore.\n\nWitnesses claim the canyon occasionally produces voices that seem delayed or altered. Some describe hearing unfamiliar phrases after speaking. Others report sounds that appear to come from impossible directions. Such accounts have inspired many theories.\n\nAcoustic researchers have studied the canyon extensively. Although its structure creates unusual sound reflections, not every report can be easily explained. The mystery remains a popular topic among visitors. Echo Canyon continues to challenge expectations.',
    image: require('../irdeimgs/EchoCanyon.png'),
    lat: 36.1,
    lng: -112.1,
  },
  {
    id: 12,
    name: 'Obsidian Shore',
    region: 'Big Island, Hawaii',
    shortDescription:
      'A black coastline linked to legends of mysterious disappearances.',
    fullDescription:
      'Obsidian Shore stretches along a rugged and isolated coastline. Its dark rocks create a dramatic and unsettling landscape. Local legends tell of travelers who vanished near the water without a trace. These stories have been passed down for generations.\n\nWitnesses have reported strange lights moving above the waves during foggy nights. Some describe hearing distant sounds resembling bells or music. Others claim the shoreline feels unusually silent despite crashing waves. Such experiences have strengthened the area’s mysterious reputation.\n\nInvestigators have searched for practical explanations. While weather and geography may contribute to unusual conditions, many stories remain unresolved. The coastline continues to attract curious visitors. Obsidian Shore remains one of the region’s enduring mysteries.',
    image: require('../irdeimgs/ObsidianShore.png'),
    lat: 19.4,
    lng: -155.3,
  },
  {
    id: 13,
    name: 'Veil Marsh',
    region: 'Munster, Ireland',
    shortDescription:
      'A mist-covered wetland where strange figures are often reported.',
    fullDescription:
      'Veil Marsh is rarely seen without a layer of dense fog. The landscape appears to change constantly as mist drifts across the water. Local folklore speaks of shadowy figures wandering through the haze. Many stories claim these figures vanish when approached.\n\nVisitors often report seeing movement at the edge of their vision. Some describe silhouettes standing motionless among the reeds. Others claim the fog itself seems to form recognizable shapes. These experiences have inspired countless tales.\n\nResearchers attribute many sightings to natural optical effects. However, the consistency of certain reports remains intriguing. The marsh continues to capture the imagination of visitors. Veil Marsh remains shrouded in mystery.',
    image: require('../irdeimgs/VeilMarsh.png'),
    lat: 52.2,
    lng: -8.5,
  },
  {
    id: 14,
    name: 'Forgotten Gate',
    region: "Ma'an, Jordan",
    shortDescription: 'An ancient stone entrance whose purpose remains unknown.',
    fullDescription:
      'Forgotten Gate stands alone in a remote landscape. The structure resembles a doorway but leads nowhere. Historians have debated its origins for decades. No records clearly explain who built it or why.\n\nLegends claim the gate once marked the boundary between distant lands. Some visitors describe unusual sensations when standing beneath it. Others report vivid dreams after visiting the site. These stories have become central to the gate’s mythology.\n\nArchaeological studies have revealed little about its purpose. The structure continues to resist clear interpretation. Every theory raises new questions. Forgotten Gate remains one of the most intriguing relics of the past.',
    image: require('../irdeimgs/ForgottenGate.png'),
    lat: 30.3,
    lng: 35.4,
  },
  {
    id: 15,
    name: 'Silver Grove',
    region: 'Centre-Val, France',
    shortDescription:
      'A forest where trees appear to shimmer under moonlight.',
    fullDescription:
      'Silver Grove is known for its unusual appearance after dark. Under certain conditions, the trees seem to reflect pale silver light. Local legends describe the grove as a place of concealed knowledge. Many stories connect it to ancient gatherings.\n\nVisitors often report a sense of calm while walking through the forest. Others claim they hear distant music among the trees. Some even describe seeing faint lights moving between the branches. These accounts have become part of the grove’s enduring mystery.\n\nScientists have proposed explanations involving moisture and reflection. Yet many visitors believe there is more to the phenomenon. The grove continues to inspire curiosity and wonder. Silver Grove remains one of the region’s most beloved mysteries.',
    image: require('../irdeimgs/SilverGrove.png'),
    lat: 47.7,
    lng: 2.0,
  },
  {
    id: 16,
    name: 'Star Chamber',
    region: 'Giza, Egypt',
    shortDescription: 'An underground hall aligned with celestial events.',
    fullDescription:
      'Star Chamber is a concealed structure carved deep beneath the earth. Its ceiling contains patterns that resemble constellations. The purpose of the chamber remains uncertain. Historians believe it may have been used for ceremonies or observations.\n\nAccording to legend, the chamber reacts to specific celestial alignments. Witnesses have reported unusual lights appearing on the walls during certain nights. Others claim the room feels different depending on the season. These stories have fueled speculation for generations.\n\nModern investigations have uncovered remarkable architectural precision. However, the true meaning behind the chamber’s design remains unknown. Researchers continue to debate its origins. Star Chamber stands as one of the most fascinating mysteries in the collection.',
    image: require('../irdeimgs/StarChamber.png'),
    lat: 29.98,
    lng: 31.13,
  },
];

export default places;
