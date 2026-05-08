import React from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export function ScreenFrame({theme, children}) {
  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.shell, {backgroundColor: theme.colors.background}]}>{children}</View>
    </SafeAreaView>
  );
}

export function ScreenScroll({children, contentContainerStyle}) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}>
      {children}
    </ScrollView>
  );
}

export function TopBar({theme, title, subtitle, onBack, rightLabel, onRightPress}) {
  return (
    <View style={styles.topBar}>
      <View style={styles.topBarLeft}>
        {onBack ? (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={onBack}
            style={[styles.backButton, {borderColor: theme.colors.border}]}>
            <Text style={[styles.backText, {color: theme.colors.text}]}>Back</Text>
          </TouchableOpacity>
        ) : null}
        <View style={styles.topBarCopy}>
          <Text style={[styles.pageTitle, {color: theme.colors.text}]}>{title}</Text>
          {subtitle ? (
            <Text style={[styles.pageSubtitle, {color: theme.colors.textMuted}]}>{subtitle}</Text>
          ) : null}
        </View>
      </View>
      {rightLabel && onRightPress ? (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onRightPress}
          style={[styles.rightButton, {backgroundColor: theme.colors.panelAlt}]}>
          <Text style={[styles.rightButtonText, {color: theme.colors.accent}]}>{rightLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export function Panel({theme, children, style}) {
  return (
    <View
      style={[
        styles.panel,
        theme.shadow,
        {
          backgroundColor: theme.colors.panel,
          borderColor: theme.colors.border,
        },
        style,
      ]}>
      {children}
    </View>
  );
}

export function SectionTitle({theme, title, actionLabel, onActionPress}) {
  return (
    <View style={styles.sectionRow}>
      <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>{title}</Text>
      {actionLabel && onActionPress ? (
        <TouchableOpacity onPress={onActionPress}>
          <Text style={[styles.sectionAction, {color: theme.colors.accent}]}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export function StatusBadge({theme, label, tone = 'accent'}) {
  const toneMap = {
    accent: {background: theme.colors.accentSoft, color: theme.colors.accent},
    blue: {background: theme.colors.blueSoft, color: theme.colors.blue},
    green: {background: theme.colors.greenSoft, color: theme.colors.green},
    gold: {background: theme.colors.goldSoft, color: theme.colors.gold},
    danger: {background: theme.colors.dangerSoft, color: theme.colors.danger},
  };
  const selected = toneMap[tone] || toneMap.accent;

  return (
    <View style={[styles.badge, {backgroundColor: selected.background}]}>
      <Text style={[styles.badgeText, {color: selected.color}]}>{label}</Text>
    </View>
  );
}

export function PrimaryButton({theme, label, onPress, disabled, style}) {
  return (
    <TouchableOpacity
      activeOpacity={0.92}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.primaryButton,
        {
          backgroundColor: disabled ? theme.colors.chip : theme.colors.accent,
        },
        style,
      ]}>
      <Text style={[styles.primaryButtonText, {color: disabled ? theme.colors.textMuted : '#FFFFFF'}]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function SecondaryButton({theme, label, onPress, disabled, style}) {
  return (
    <TouchableOpacity
      activeOpacity={0.92}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.secondaryButton,
        {
          backgroundColor: theme.colors.panelAlt,
          borderColor: theme.colors.border,
          opacity: disabled ? 0.55 : 1,
        },
        style,
      ]}>
      <Text style={[styles.secondaryButtonText, {color: theme.colors.text}]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function MetricCard({theme, label, value, tone = 'blue'}) {
  const toneMap = {
    blue: {background: theme.colors.blueSoft, color: theme.colors.blue},
    green: {background: theme.colors.greenSoft, color: theme.colors.green},
    gold: {background: theme.colors.goldSoft, color: theme.colors.gold},
    accent: {background: theme.colors.accentSoft, color: theme.colors.accent},
  };
  const selected = toneMap[tone] || toneMap.blue;

  return (
    <View style={[styles.metricCard, {backgroundColor: selected.background}]}>
      <Text style={[styles.metricValue, {color: selected.color}]}>{value}</Text>
      <Text style={[styles.metricLabel, {color: selected.color}]}>{label}</Text>
    </View>
  );
}

export function InfoStrip({theme, title, text, tone = 'blue'}) {
  const toneMap = {
    blue: {background: theme.colors.blueSoft, color: theme.colors.blue},
    green: {background: theme.colors.greenSoft, color: theme.colors.green},
    gold: {background: theme.colors.goldSoft, color: theme.colors.gold},
    danger: {background: theme.colors.dangerSoft, color: theme.colors.danger},
    accent: {background: theme.colors.accentSoft, color: theme.colors.accent},
  };
  const selected = toneMap[tone] || toneMap.blue;

  return (
    <View style={[styles.infoStrip, {backgroundColor: selected.background}]}>
      <Text style={[styles.infoTitle, {color: selected.color}]}>{title}</Text>
      <Text style={[styles.infoText, {color: selected.color}]}>{text}</Text>
    </View>
  );
}

export function InputField({
  theme,
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  maxLength,
  multiline,
}) {
  return (
    <View style={styles.inputWrap}>
      <Text style={[styles.inputLabel, {color: theme.colors.textMuted}]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        keyboardType={keyboardType}
        maxLength={maxLength}
        multiline={multiline}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.panelAlt,
            borderColor: theme.colors.border,
            color: theme.colors.text,
            minHeight: multiline ? 120 : 52,
            textAlignVertical: multiline ? 'top' : 'center',
          },
        ]}
      />
    </View>
  );
}

export function ToggleRow({theme, label, description, value, onValueChange}) {
  return (
    <View style={[styles.toggleRow, {borderColor: theme.colors.border}]}>
      <View style={styles.toggleCopy}>
        <Text style={[styles.toggleLabel, {color: theme.colors.text}]}>{label}</Text>
        {description ? (
          <Text style={[styles.toggleDescription, {color: theme.colors.textMuted}]}>
            {description}
          </Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        thumbColor={'#FFFFFF'}
        trackColor={{false: theme.colors.chip, true: theme.colors.green}}
      />
    </View>
  );
}

export function EmptyState({theme, title, text}) {
  return (
    <Panel theme={theme} style={styles.emptyPanel}>
      <Text style={[styles.emptyTitle, {color: theme.colors.text}]}>{title}</Text>
      <Text style={[styles.emptyText, {color: theme.colors.textMuted}]}>{text}</Text>
    </Panel>
  );
}

export function BottomTabs({theme, currentRoute, routes, onChange}) {
  return (
    <View style={[styles.bottomTabs, {backgroundColor: theme.colors.panel, borderColor: theme.colors.border}]}>
      {routes.map(item => {
        const selected = currentRoute === item.key;
        return (
          <Pressable
            key={item.key}
            onPress={() => onChange(item.key)}
            style={[styles.tabItem, {backgroundColor: selected ? theme.colors.accentSoft : 'transparent'}]}>
            <Text style={[styles.tabText, {color: selected ? theme.colors.accent : theme.colors.textMuted}]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function SheetModal({visible, onClose, theme, children}) {
  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.modalBackdrop, {backgroundColor: theme.colors.overlay}]}>
        <Pressable style={styles.modalDismiss} onPress={onClose} />
        <View style={[styles.sheet, {backgroundColor: theme.colors.panel}]}>
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {flex: 1},
  shell: {flex: 1},
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 120,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  topBarCopy: {flex: 1},
  backButton: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  backText: {
    fontSize: 13,
    fontWeight: '700',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
  },
  pageSubtitle: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '500',
  },
  rightButton: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  rightButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  panel: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  sectionAction: {
    fontSize: 13,
    fontWeight: '700',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  primaryButton: {
    minHeight: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButton: {
    minHeight: 50,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  metricCard: {
    flex: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 16,
    marginRight: 10,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  metricLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
  },
  infoStrip: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },
  inputWrap: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: '600',
  },
  toggleRow: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleCopy: {
    flex: 1,
    paddingRight: 14,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
  toggleDescription: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
  },
  emptyPanel: {
    alignItems: 'center',
    paddingVertical: 36,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  bottomTabs: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    borderWidth: 1,
    borderRadius: 22,
    flexDirection: 'row',
    padding: 8,
  },
  tabItem: {
    flex: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '800',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalDismiss: {
    flex: 1,
  },
  sheet: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 30,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
  },
});
