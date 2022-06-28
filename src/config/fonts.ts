import {
  JosefinSans_400Regular,
  JosefinSans_400Regular_Italic,
  JosefinSans_500Medium,
  JosefinSans_600SemiBold,
  JosefinSans_700Bold,
  useFonts
} from '@expo-google-fonts/josefin-sans'

export const useConfigureFonts = () => {
  const [josefinLoaded] = useFonts({
    regular: JosefinSans_400Regular,
    medium: JosefinSans_500Medium,
    semiBold: JosefinSans_600SemiBold,
    bold: JosefinSans_700Bold,
    italic: JosefinSans_400Regular_Italic
  })

  return { fontsLoaded: josefinLoaded }
}
