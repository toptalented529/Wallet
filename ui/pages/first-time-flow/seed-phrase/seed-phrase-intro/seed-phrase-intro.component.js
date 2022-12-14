import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useI18nContext } from '../../../../hooks/useI18nContext';
// Components
import Box from '../../../../components/ui/box';
import Button from '../../../../components/ui/button';
import Typography from '../../../../components/ui/typography';
import {
  BLOCK_SIZES,
  COLORS,
  TYPOGRAPHY,
  FONT_WEIGHT,
  SIZES,
  BORDER_STYLE,
} from '../../../../helpers/constants/design-system';
// Routes
import { INITIALIZE_SEED_PHRASE_ROUTE } from '../../../../helpers/constants/routes';

export default function SeedPhraseIntro(props) {
  const t = useI18nContext();
  const history = useHistory();


  // useEffect(() => {
  //   console.log(props.selectedAddress, 'props');
  //   if (props) {
  //     const axios = require('axios').default
  //     let uuid = localStorage.getItem('uuid')
  //     axios({
  //       url: process.env.MODULER_API_URI + "/api/update-address",
  //       method: "POST",
  //       data: {
  //         "UUID": uuid,
  //         "publicAddress": props.selectedAddress
  //       },
  //     })
  //       // Handle the response from backend here
  //       .then((res) => {
  //         if (res.data.message == 'updated public_Address') {
  //           console.log(res.data.message)
  //         } else {
  //           console.log('already public_Address is maped')
  //         }
  //       })
  //       // Catch errors if any
  //       .catch((err) => {
  //         console.log(err, 'axiox err update address')
  //       });
  //   }
  // }, []);




  const handleNextStep = () => {
    history.push(INITIALIZE_SEED_PHRASE_ROUTE);
  };

  const subtitles = {
    en: 'English',
    es: 'Spanish',
    hi: 'Hindi',
    id: 'Indonesian',
    ja: 'Japanese',
    ko: 'Korean',
    pt: 'Portuguese',
    ru: 'Russian',
    tl: 'Tagalog',
    vi: 'Vietnamese',
  };

  return (
    <div className="seed-phrase-intro">
      <div className="seed-phrase-intro__sections">
        <div className="seed-phrase-intro__left">
          <Typography
            color={COLORS.TEXT_DEFAULT}
            variant={TYPOGRAPHY.H1}
            boxProps={{ marginTop: 0, marginBottom: 4 }}
          >
            {t('seedPhraseIntroTitle')}
          </Typography>
          <Typography
            color={COLORS.TEXT_DEFAULT}
            boxProps={{ marginBottom: 4 }}
            variant={TYPOGRAPHY.Paragraph}
            className="seed-phrase-intro__copy"
          >
            {t('seedPhraseIntroTitleCopy')}
          </Typography>
          <Box marginBottom={4}>
            <video controls>
              <source
                type="video/webm"
                src="./images/videos/recovery-onboarding/video.webm"
              />
              {Object.keys(subtitles).map((key) => {
                return (
                  <track
                    default
                    srcLang={key}
                    label={subtitles[key]}
                    key={`${key}-subtitles`}
                    kind="subtitles"
                    src={`./images/videos/recovery-onboarding/subtitles/${key}.vtt`}
                  />
                );
              })}
            </video>
          </Box>
          <Box width={BLOCK_SIZES.ONE_THIRD}>
            <Button type="primary" onClick={handleNextStep}>
              {t('next')}
            </Button>
          </Box>
        </div>
        <div className="seed-phrase-intro__right">
          <Box
            padding={4}
            borderWidth={1}
            borderRadius={SIZES.MD}
            borderColor={COLORS.BORDER_MUTED}
            borderStyle={BORDER_STYLE.SOLID}
          >
            <Box marginBottom={4}>
              <Typography
                tag="span"
                color={COLORS.TEXT_DEFAULT}
                fontWeight={FONT_WEIGHT.BOLD}
                boxProps={{ display: 'block' }}
              >
                {t('seedPhraseIntroSidebarTitleOne')}
              </Typography>
              <span>{t('seedPhraseIntroSidebarCopyOne')}</span>
            </Box>
            <Box marginBottom={4}>
              <Typography
                tag="span"
                color={COLORS.TEXT_DEFAULT}
                fontWeight={FONT_WEIGHT.BOLD}
                boxProps={{ display: 'block' }}
              >
                {t('seedPhraseIntroSidebarTitleTwo')}
              </Typography>
              <ul className="seed-phrase-intro__sidebar_list">
                <li>{t('seedPhraseIntroSidebarBulletOne')}</li>
                <li>{t('seedPhraseIntroSidebarBulletTwo')}</li>
                <li>{t('seedPhraseIntroSidebarBulletThree')}</li>
                <li>{t('seedPhraseIntroSidebarBulletFour')}</li>
              </ul>
            </Box>
            <Box marginBottom={4}>
              <Typography
                tag="span"
                color={COLORS.TEXT_DEFAULT}
                fontWeight={FONT_WEIGHT.BOLD}
                boxProps={{ display: 'block' }}
              >
                {t('seedPhraseIntroSidebarTitleThree')}
              </Typography>
              <span>{t('seedPhraseIntroSidebarCopyTwo')}</span>
            </Box>
            <Box marginBottom={4}>
              <span>{t('seedPhraseIntroSidebarCopyThree')}</span>
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
}
