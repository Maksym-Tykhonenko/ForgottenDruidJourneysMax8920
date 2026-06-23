import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Share,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import {
  ImagePlus,
  Pencil,
  Plus,
  Share2,
  Trash2,
  X,
} from 'lucide-react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { ScreenCanvas } from '../components/ScreenCanvas';
import { Body, Display } from '../components/GlyphText';
import { EmberButton } from '../components/EmberButton';
import { Tappable } from '../components/Tappable';
import { IconPuck } from '../components/IconPuck';
import { Aura, GlowOrb } from '../components/Aura';
import { ConfirmDialog } from '../components/ConfirmDialog';
import {
  bottomSafePad,
  Gradients,
  Palette,
  Radii,
  Spacing,
} from '../theme';
import { Illustrations } from '../data/artwork';
import { ArchiveEntry, useVault } from '../vault/VaultProvider';

interface Draft {
  id: string | null;
  note: string;
  imageUri: string;
}

const EMPTY_DRAFT: Draft = { id: null, note: '', imageUri: '' };

export const ArchiveScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { archive, addEntry, updateEntry, removeEntry } = useVault();
  const [editorOpen, setEditorOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const openCreate = () => {
    setDraft(EMPTY_DRAFT);
    setEditorOpen(true);
  };
  const openEdit = (entry: ArchiveEntry) => {
    setDraft({ id: entry.id, note: entry.note, imageUri: entry.imageUri });
    setEditorOpen(true);
  };

  const pickPhoto = async () => {
    const res = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
    });
    const uri = res.assets?.[0]?.uri;
    if (uri) setDraft(d => ({ ...d, imageUri: uri }));
  };

  const canSave = draft.note.trim().length > 0 && draft.imageUri.length > 0;
  const save = () => {
    if (!canSave) return;
    if (draft.id) updateEntry(draft.id, draft.note.trim(), draft.imageUri);
    else addEntry(draft.note.trim(), draft.imageUri);
    setEditorOpen(false);
    Keyboard.dismiss();
  };

  const shareEntry = (entry: ArchiveEntry) => {
    Share.share({
      message: `My observation from Forgotten Journeys:\n\n${entry.note}`,
      url: entry.imageUri,
    }).catch(() => {});
  };

  const isEmpty = archive.length === 0;

  const renderItem = ({
    item,
    index,
  }: {
    item: ArchiveEntry;
    index: number;
  }) => (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index, 8) * 60).duration(420)}
      exiting={FadeOut.duration(180)}
      style={styles.entry}>
      <Image source={{ uri: item.imageUri }} style={styles.entryImage} />
      <View style={styles.entryBody}>
        <Body variant="body" numberOfLines={3}>
          {item.note}
        </Body>
        <View style={styles.entryActions}>
          <Tappable onPress={() => openEdit(item)} style={styles.miniBtn}>
            <Pencil size={14} color={Palette.frost} strokeWidth={2} />
            <Body variant="small" color={Palette.frost}>
              Edit
            </Body>
          </Tappable>
          <Tappable onPress={() => shareEntry(item)} style={styles.miniBtn}>
            <Share2 size={14} color={Palette.frost} strokeWidth={2} />
            <Body variant="small" color={Palette.frost}>
              Share
            </Body>
          </Tappable>
          <Tappable
            onPress={() => setPendingDelete(item.id)}
            style={[styles.miniBtn, styles.deleteBtn]}>
            <Trash2 size={14} color={Palette.wrong} strokeWidth={2} />
            <Body variant="small" color={Palette.wrong}>
              Delete
            </Body>
          </Tappable>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <ScreenCanvas
      title="Gallery"
      subtitle={`${archive.length} ${archive.length === 1 ? 'ENTRY' : 'ENTRIES'}`}
      headerRight={
        !isEmpty ? (
          <IconPuck tone="ember" active size={42} onPress={openCreate}>
            <Plus size={20} color={Palette.ember} strokeWidth={2.6} />
          </IconPuck>
        ) : undefined
      }>
      {isEmpty ? (
        <Animated.View entering={FadeIn.duration(500)} style={styles.empty}>
          <View style={styles.emptyArt}>
            <GlowOrb
              color={Palette.emberGlow}
              size={280}
              opacity={0.45}
              style={styles.emptyOrb}
            />
            <Image source={Illustrations.archiveDoor} style={styles.emptyImg} />
          </View>
          <Display variant="section" align="center">
            Your Archive
          </Display>
          <Body variant="lead" align="center" style={styles.emptyText}>
            Record your observations, theories, and discoveries as you explore
            the world's mysteries.
          </Body>
          <EmberButton
            label="Add Observation"
            onPress={openCreate}
            icon={<Plus size={16} color={Palette.abyss} strokeWidth={2.6} />}
            style={styles.emptyCta}
          />
        </Animated.View>
      ) : (
        <FlatList
          data={archive}
          keyExtractor={i => i.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: bottomSafePad(insets.bottom) },
          ]}
        />
      )}

      <EditorModal
        visible={editorOpen}
        draft={draft}
        canSave={canSave}
        onChangeNote={t => setDraft(d => ({ ...d, note: t }))}
        onPickPhoto={pickPhoto}
        onSave={save}
        onClose={() => {
          setEditorOpen(false);
          Keyboard.dismiss();
        }}
      />

      <ConfirmDialog
        visible={!!pendingDelete}
        title="Delete Entry?"
        message="This observation will be removed from your archive."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={() => {
          if (pendingDelete) removeEntry(pendingDelete);
          setPendingDelete(null);
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </ScreenCanvas>
  );
};

interface EditorModalProps {
  visible: boolean;
  draft: Draft;
  canSave: boolean;
  onChangeNote: (t: string) => void;
  onPickPhoto: () => void;
  onSave: () => void;
  onClose: () => void;
}

const EditorModal: React.FC<EditorModalProps> = ({
  visible,
  draft,
  canSave,
  onChangeNote,
  onPickPhoto,
  onSave,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Animated.View
          entering={FadeIn.duration(180)}
          exiting={FadeOut.duration(160)}
          style={StyleSheet.absoluteFill}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.scrim} />
          </TouchableWithoutFeedback>
        </Animated.View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetWrap}>
          <Animated.View
            entering={SlideInDown.springify().damping(20).stiffness(180)}
            exiting={SlideOutDown.duration(200)}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <Aura
                colors={Gradients.card}
                angle={120}
                radius={Radii.xl}
                style={[styles.sheet, { paddingBottom: insets.bottom + 18 }]}>
                <View style={styles.sheetHead}>
                  <Display variant="section">New Observation</Display>
                  <IconPuck size={32} onPress={onClose}>
                    <X size={16} color={Palette.inkSoft} strokeWidth={2.4} />
                  </IconPuck>
                </View>

                <Tappable onPress={onPickPhoto} style={styles.photoPick}>
                  {draft.imageUri ? (
                    <Image
                      source={{ uri: draft.imageUri }}
                      style={styles.photoPreview}
                    />
                  ) : (
                    <View style={styles.photoEmpty}>
                      <ImagePlus
                        size={22}
                        color={Palette.frost}
                        strokeWidth={2}
                      />
                      <Body variant="body" color={Palette.frost}>
                        Add photo
                      </Body>
                    </View>
                  )}
                </Tappable>

                <TextInput
                  value={draft.note}
                  onChangeText={onChangeNote}
                  placeholder="Write your observation or theory..."
                  placeholderTextColor={Palette.inkFaint}
                  multiline
                  style={styles.input}
                />

                <EmberButton
                  label="Save Entry"
                  onPress={onSave}
                  disabled={!canSave}
                  style={styles.saveBtn}
                />
              </Aura>
            </TouchableWithoutFeedback>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  list: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.sm },
  entry: {
    flexDirection: 'row',
    backgroundColor: Palette.glass,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Palette.glassLine,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  entryImage: {
    width: 92,
    height: 92,
    borderRadius: Radii.md,
    backgroundColor: Palette.midnight,
  },
  entryBody: { flex: 1, marginLeft: Spacing.md, justifyContent: 'space-between' },
  entryActions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  miniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.sm,
    backgroundColor: Palette.glassRaised,
    borderWidth: 1,
    borderColor: Palette.glassLineSoft,
  },
  deleteBtn: { backgroundColor: Palette.wrongSoft, borderColor: 'transparent' },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  emptyArt: { alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg },
  emptyOrb: { position: 'absolute' },
  emptyImg: { width: 210, height: 210, resizeMode: 'contain' },
  emptyText: { marginTop: Spacing.md },
  emptyCta: { marginTop: Spacing.xxl },
  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  scrim: { flex: 1, backgroundColor: 'rgba(4,8,20,0.74)' },
  sheetWrap: { width: '100%' },
  sheet: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    borderTopLeftRadius: Radii.xl,
    borderTopRightRadius: Radii.xl,
    borderWidth: 1,
    borderColor: Palette.glassLine,
  },
  sheetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  photoPick: {
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Palette.glassLine,
    backgroundColor: Palette.glassRaised,
    overflow: 'hidden',
    height: 150,
  },
  photoEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  photoPreview: { width: '100%', height: '100%' },
  input: {
    marginTop: Spacing.lg,
    minHeight: 96,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Palette.glassLine,
    backgroundColor: Palette.glassRaised,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    color: Palette.ink,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  saveBtn: { marginTop: Spacing.xl },
});
