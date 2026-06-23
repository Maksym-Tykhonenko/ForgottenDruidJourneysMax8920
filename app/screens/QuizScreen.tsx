import React, { useCallback, useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { Check, RotateCcw, Sparkles, X } from 'lucide-react-native';
import { ScreenCanvas } from '../components/ScreenCanvas';
import { Body, Display } from '../components/GlyphText';
import { EmberButton } from '../components/EmberButton';
import { Tappable } from '../components/Tappable';
import { VeilCard } from '../components/VeilCard';
import { Aura, GlowOrb } from '../components/Aura';
import { IconPuck } from '../components/IconPuck';
import { ConfirmDialog } from '../components/ConfirmDialog';
import {
  bottomSafePad,
  Gradients,
  Palette,
  Radii,
  Spacing,
} from '../theme';
import { buildTrial, TrialQuestion, TRIAL_LENGTH } from '../data/catalogue';
import { Illustrations } from '../data/artwork';
import { useVault } from '../vault/VaultProvider';
import { pulse } from '../vault/haptics';

type Phase = 'intro' | 'playing' | 'result';
type Choice = 'True' | 'False';

const ProgressBar: React.FC<{ ratio: number }> = ({ ratio }) => {
  const width = useDerivedValue(() => withTiming(ratio, { duration: 420 }));
  const style = useAnimatedStyle(() => ({
    width: `${Math.max(4, width.value * 100)}%`,
  }));
  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, style]}>
        <Aura colors={Gradients.ember} angle={0} style={styles.fillInner} />
      </Animated.View>
    </View>
  );
};

const AnswerButton: React.FC<{
  label: Choice;
  state: 'idle' | 'correct' | 'wrong' | 'muted';
  onPress: () => void;
  disabled: boolean;
}> = ({ label, state, onPress, disabled }) => {
  const tone =
    state === 'correct'
      ? { bg: Palette.correctSoft, border: Palette.correct, text: Palette.correct }
      : state === 'wrong'
      ? { bg: Palette.wrongSoft, border: Palette.wrong, text: Palette.wrong }
      : { bg: Palette.glassRaised, border: Palette.glassLine, text: Palette.ink };

  return (
    <Tappable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.answer,
        { backgroundColor: tone.bg, borderColor: tone.border },
        state === 'muted' && styles.muted,
      ]}>
      <Display variant="button" color={tone.text} style={styles.answerLabel}>
        {label}
      </Display>
      {state === 'correct' ? (
        <Check size={16} color={Palette.correct} strokeWidth={3} />
      ) : state === 'wrong' ? (
        <X size={16} color={Palette.wrong} strokeWidth={3} />
      ) : null}
    </Tappable>
  );
};

export const QuizScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { settings } = useVault();
  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<TrialQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<Choice | null>(null);
  const [score, setScore] = useState(0);
  const [confirmExit, setConfirmExit] = useState(false);

  const start = useCallback(() => {
    setQuestions(buildTrial(TRIAL_LENGTH));
    setIndex(0);
    setPicked(null);
    setScore(0);
    setPhase('playing');
  }, []);

  const answer = (choice: Choice) => {
    if (picked) return;
    const q = questions[index];
    const right = choice === q.answer;
    setPicked(choice);
    if (right) {
      setScore(s => s + 1);
      pulse(settings.vibration, 'tap');
    } else {
      pulse(settings.vibration, 'error');
    }
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      setPhase('result');
      return;
    }
    setIndex(i => i + 1);
    setPicked(null);
  };

  // ---- INTRO ----
  if (phase === 'intro') {
    return (
      <ScreenCanvas>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.introScroll,
            { paddingBottom: bottomSafePad(insets.bottom) },
          ]}>
          <Animated.View entering={FadeIn.duration(500)} style={styles.introArt}>
            <GlowOrb
              color={Palette.emberGlow}
              size={300}
              opacity={0.5}
              style={styles.introOrb}
            />
            <Image source={Illustrations.quizPortal} style={styles.portal} />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(150).duration(520)}>
            <Display variant="title" align="center">
              Mystery Quiz
            </Display>
            <Body variant="lead" align="center" style={styles.introBody}>
              The old wanderer challenges your knowledge. Answer True or False —
              then learn the story behind each mystery.
            </Body>
            <Display
              variant="eyebrow"
              align="center"
              color={Palette.ember}
              style={styles.introMeta}>
              {TRIAL_LENGTH} QUESTIONS · TRUE OR FALSE
            </Display>
          </Animated.View>
          <Animated.View
            entering={FadeInUp.delay(280).duration(520)}
            style={styles.introCta}>
            <EmberButton label="Begin the Quiz" onPress={start} />
          </Animated.View>
        </ScrollView>
      </ScreenCanvas>
    );
  }

  // ---- RESULT ----
  if (phase === 'result') {
    const verdict =
      score >= 8
        ? 'Remarkable. The mysteries reveal themselves to you.'
        : score >= 5
        ? 'A decent result. The mysteries still have much to teach you.'
        : 'The fog remains. Revisit the stories and try once more.';
    return (
      <ScreenCanvas>
        <View style={styles.resultWrap}>
          <Animated.View entering={FadeIn.duration(500)} style={styles.introArt}>
            <GlowOrb
              color={Palette.emberGlow}
              size={300}
              opacity={0.55}
              style={styles.introOrb}
            />
            <Sparkles size={92} color={Palette.emberBright} strokeWidth={1.4} />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(120).duration(520)}>
            <Display variant="eyebrow" align="center" color={Palette.frost}>
              {score} OUT OF {questions.length}
            </Display>
            <Display variant="title" align="center" style={styles.resultTitle}>
              Quiz Complete
            </Display>
            <Body variant="lead" align="center" style={styles.introBody}>
              {verdict}
            </Body>
          </Animated.View>
          <Animated.View
            entering={FadeInUp.delay(260).duration(520)}
            style={styles.introCta}>
            <EmberButton
              label="Restart Quiz"
              onPress={start}
              icon={<RotateCcw size={16} color={Palette.abyss} strokeWidth={2.4} />}
            />
          </Animated.View>
        </View>
      </ScreenCanvas>
    );
  }

  // ---- PLAYING ----
  const q = questions[index];
  const stateFor = (label: Choice): 'idle' | 'correct' | 'wrong' | 'muted' => {
    if (!picked) return 'idle';
    if (label === q.answer) return 'correct';
    if (label === picked) return 'wrong';
    return 'muted';
  };

  return (
    <ScreenCanvas edges={['top']}>
      <View style={styles.playTop}>
        <ProgressBar ratio={(index + (picked ? 1 : 0)) / questions.length} />
        <IconPuck size={34} onPress={() => setConfirmExit(true)}>
          <X size={17} color={Palette.inkSoft} strokeWidth={2.4} />
        </IconPuck>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.playScroll,
          { paddingBottom: bottomSafePad(insets.bottom) },
        ]}>
        <Display variant="eyebrow" color={Palette.inkMuted}>
          QUESTION {index + 1} OF {questions.length}
        </Display>

        <Animated.View key={`q${index}`} entering={FadeIn.duration(420)}>
          <VeilCard style={styles.statementCard}>
            <Display variant="card" style={styles.statement}>
              “{q.statement}”
            </Display>
          </VeilCard>

          <View style={styles.answers}>
            <AnswerButton
              label="True"
              state={stateFor('True')}
              onPress={() => answer('True')}
              disabled={!!picked}
            />
            <AnswerButton
              label="False"
              state={stateFor('False')}
              onPress={() => answer('False')}
              disabled={!!picked}
            />
          </View>

          {picked ? (
            <Animated.View entering={FadeInUp.duration(420)}>
              <View
                style={[
                  styles.explain,
                  {
                    borderColor:
                      picked === q.answer ? Palette.correct : Palette.wrong,
                  },
                ]}>
                <View style={styles.explainHead}>
                  {picked === q.answer ? (
                    <Check size={15} color={Palette.correct} strokeWidth={3} />
                  ) : (
                    <X size={15} color={Palette.wrong} strokeWidth={3} />
                  )}
                  <Display
                    variant="eyebrow"
                    color={picked === q.answer ? Palette.correct : Palette.wrong}>
                    {picked === q.answer ? 'CORRECT' : 'NOT QUITE'}
                  </Display>
                </View>
                <Body variant="body" style={styles.explainBody}>
                  {q.explanation}
                </Body>
              </View>
              <EmberButton
                label={index + 1 >= questions.length ? 'See Result' : 'Next Question'}
                onPress={next}
                style={styles.nextBtn}
              />
            </Animated.View>
          ) : null}
        </Animated.View>
      </ScrollView>

      <ConfirmDialog
        visible={confirmExit}
        title="Exit Quiz?"
        message="Your progress will be lost. Are you sure you want to leave?"
        confirmLabel="Exit"
        cancelLabel="Stay"
        onConfirm={() => {
          setConfirmExit(false);
          setPhase('intro');
        }}
        onCancel={() => setConfirmExit(false)}
      />
    </ScreenCanvas>
  );
};

const styles = StyleSheet.create({
  introScroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
  },
  introArt: { alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl },
  introOrb: { position: 'absolute' },
  portal: { width: 200, height: 200, resizeMode: 'contain' },
  introBody: { marginTop: Spacing.md },
  introMeta: { marginTop: Spacing.lg },
  introCta: { marginTop: Spacing.huge },
  resultWrap: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultTitle: { marginTop: 8 },
  playTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  track: {
    flex: 1,
    height: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(143,180,255,0.16)',
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 6, overflow: 'hidden' },
  fillInner: { flex: 1 },
  playScroll: { paddingHorizontal: Spacing.xl },
  statementCard: { marginTop: Spacing.lg },
  statement: { lineHeight: 24 },
  answers: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.xl },
  answer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    borderRadius: Radii.md,
    borderWidth: 1,
  },
  answerLabel: { color: Palette.ink },
  muted: { opacity: 0.5 },
  explain: {
    marginTop: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: Radii.md,
    borderWidth: 1,
    backgroundColor: 'rgba(15,26,60,0.7)',
  },
  explainHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  explainBody: { marginTop: Spacing.sm },
  nextBtn: { marginTop: Spacing.xl },
});
