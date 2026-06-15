import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_en.dart';
import 'app_localizations_ru.dart';
import 'app_localizations_uz.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
      : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
    delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
  ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('en'),
    Locale('ru'),
    Locale('uz')
  ];

  /// No description provided for @appName.
  ///
  /// In uz, this message translates to:
  /// **'Quyoshli'**
  String get appName;

  /// No description provided for @navHome.
  ///
  /// In uz, this message translates to:
  /// **'Asosiy'**
  String get navHome;

  /// No description provided for @navCatalog.
  ///
  /// In uz, this message translates to:
  /// **'Katalog'**
  String get navCatalog;

  /// No description provided for @navCart.
  ///
  /// In uz, this message translates to:
  /// **'Savat'**
  String get navCart;

  /// No description provided for @navProfile.
  ///
  /// In uz, this message translates to:
  /// **'Profil'**
  String get navProfile;

  /// No description provided for @search.
  ///
  /// In uz, this message translates to:
  /// **'Qidiruv'**
  String get search;

  /// No description provided for @favorites.
  ///
  /// In uz, this message translates to:
  /// **'Sevimlilar'**
  String get favorites;

  /// No description provided for @sectionHot.
  ///
  /// In uz, this message translates to:
  /// **'Qaynoq narxlar!!'**
  String get sectionHot;

  /// No description provided for @sectionNew.
  ///
  /// In uz, this message translates to:
  /// **'Yangi mahsulotlar'**
  String get sectionNew;

  /// No description provided for @sectionBest.
  ///
  /// In uz, this message translates to:
  /// **'Ko\'p sotilgan mahsulotlar'**
  String get sectionBest;

  /// No description provided for @sectionBrands.
  ///
  /// In uz, this message translates to:
  /// **'Brendlar'**
  String get sectionBrands;

  /// No description provided for @seeAll.
  ///
  /// In uz, this message translates to:
  /// **'Hammasi'**
  String get seeAll;

  /// No description provided for @qaCatalog.
  ///
  /// In uz, this message translates to:
  /// **'Katalog'**
  String get qaCatalog;

  /// No description provided for @qaServices.
  ///
  /// In uz, this message translates to:
  /// **'Xizmatlar'**
  String get qaServices;

  /// No description provided for @qaPartnership.
  ///
  /// In uz, this message translates to:
  /// **'Hamkorlik'**
  String get qaPartnership;

  /// No description provided for @qaUseful.
  ///
  /// In uz, this message translates to:
  /// **'Foydali'**
  String get qaUseful;

  /// No description provided for @badgeNew.
  ///
  /// In uz, this message translates to:
  /// **'Yangi'**
  String get badgeNew;

  /// No description provided for @badgeComingSoon.
  ///
  /// In uz, this message translates to:
  /// **'Tez kunda'**
  String get badgeComingSoon;

  /// No description provided for @addToCart.
  ///
  /// In uz, this message translates to:
  /// **'Savatga'**
  String get addToCart;

  /// No description provided for @fullDescription.
  ///
  /// In uz, this message translates to:
  /// **'To\'liq tavsif'**
  String get fullDescription;

  /// No description provided for @downloadDatasheet.
  ///
  /// In uz, this message translates to:
  /// **'Datasheet\'ni yuklab olish'**
  String get downloadDatasheet;

  /// No description provided for @inStock.
  ///
  /// In uz, this message translates to:
  /// **'Sotuvda mavjud'**
  String get inStock;

  /// No description provided for @vatIncluded.
  ///
  /// In uz, this message translates to:
  /// **'QQS bilan'**
  String get vatIncluded;

  /// No description provided for @pcs.
  ///
  /// In uz, this message translates to:
  /// **'dona'**
  String get pcs;

  /// No description provided for @cartTitle.
  ///
  /// In uz, this message translates to:
  /// **'Savat'**
  String get cartTitle;

  /// No description provided for @cartEmpty.
  ///
  /// In uz, this message translates to:
  /// **'Savatingizda hali biror narsa yo\'q'**
  String get cartEmpty;

  /// No description provided for @cartEmptySub.
  ///
  /// In uz, this message translates to:
  /// **'Asosiy sahifadan boshlang yoki kerakli mahsulotni toping'**
  String get cartEmptySub;

  /// No description provided for @goHome.
  ///
  /// In uz, this message translates to:
  /// **'Bosh sahifa'**
  String get goHome;

  /// No description provided for @orderSummary.
  ///
  /// In uz, this message translates to:
  /// **'Sizning buyurtmangiz'**
  String get orderSummary;

  /// No description provided for @discount.
  ///
  /// In uz, this message translates to:
  /// **'Maxsulotlarga chegirma'**
  String get discount;

  /// No description provided for @total.
  ///
  /// In uz, this message translates to:
  /// **'Jami:'**
  String get total;

  /// No description provided for @readySolutions.
  ///
  /// In uz, this message translates to:
  /// **'Tayyor yechimlar'**
  String get readySolutions;

  /// No description provided for @checkout.
  ///
  /// In uz, this message translates to:
  /// **'Buyurtma berish'**
  String get checkout;

  /// No description provided for @delivery.
  ///
  /// In uz, this message translates to:
  /// **'Yetkazib berish'**
  String get delivery;

  /// No description provided for @pickup.
  ///
  /// In uz, this message translates to:
  /// **'Olib ketish'**
  String get pickup;

  /// No description provided for @individual.
  ///
  /// In uz, this message translates to:
  /// **'Jis. shaxs'**
  String get individual;

  /// No description provided for @legal.
  ///
  /// In uz, this message translates to:
  /// **'Yur. shaxs'**
  String get legal;

  /// No description provided for @customer.
  ///
  /// In uz, this message translates to:
  /// **'Mijoz'**
  String get customer;

  /// No description provided for @installation.
  ///
  /// In uz, this message translates to:
  /// **'O\'rnatish'**
  String get installation;

  /// No description provided for @installSelf.
  ///
  /// In uz, this message translates to:
  /// **'O\'zim o\'rnatib olaman'**
  String get installSelf;

  /// No description provided for @installWith.
  ///
  /// In uz, this message translates to:
  /// **'O\'rnatish bilan'**
  String get installWith;

  /// No description provided for @orderAccepted.
  ///
  /// In uz, this message translates to:
  /// **'Buyurtma qabul qilindi!'**
  String get orderAccepted;

  /// No description provided for @servicesTitle.
  ///
  /// In uz, this message translates to:
  /// **'Xizmatlar'**
  String get servicesTitle;

  /// No description provided for @sendApplication.
  ///
  /// In uz, this message translates to:
  /// **'Arizani yuboring'**
  String get sendApplication;

  /// No description provided for @applicationAccepted.
  ///
  /// In uz, this message translates to:
  /// **'Arizangiz qabul qilindi!'**
  String get applicationAccepted;

  /// No description provided for @myApplications.
  ///
  /// In uz, this message translates to:
  /// **'Mening arizalarim'**
  String get myApplications;

  /// No description provided for @noApplications.
  ///
  /// In uz, this message translates to:
  /// **'Arizalar yo\'q :('**
  String get noApplications;

  /// No description provided for @myOrders.
  ///
  /// In uz, this message translates to:
  /// **'Mening buyurtmalarim'**
  String get myOrders;

  /// No description provided for @noOrders.
  ///
  /// In uz, this message translates to:
  /// **'Buyurtmalar yo\'q'**
  String get noOrders;

  /// No description provided for @profileTitle.
  ///
  /// In uz, this message translates to:
  /// **'Profil'**
  String get profileTitle;

  /// No description provided for @contactUs.
  ///
  /// In uz, this message translates to:
  /// **'Biz bilan bog\'lanish'**
  String get contactUs;

  /// No description provided for @settings.
  ///
  /// In uz, this message translates to:
  /// **'Sozlamalar'**
  String get settings;

  /// No description provided for @language.
  ///
  /// In uz, this message translates to:
  /// **'Til'**
  String get language;

  /// No description provided for @about.
  ///
  /// In uz, this message translates to:
  /// **'Ilova haqida'**
  String get about;

  /// No description provided for @offer.
  ///
  /// In uz, this message translates to:
  /// **'Oferta va foydalanish shartlari'**
  String get offer;

  /// No description provided for @logout.
  ///
  /// In uz, this message translates to:
  /// **'Chiqish'**
  String get logout;

  /// No description provided for @editProfile.
  ///
  /// In uz, this message translates to:
  /// **'Profilni tahrirlash'**
  String get editProfile;

  /// No description provided for @deleteProfile.
  ///
  /// In uz, this message translates to:
  /// **'Profilni o\'chirish'**
  String get deleteProfile;

  /// No description provided for @save.
  ///
  /// In uz, this message translates to:
  /// **'Saqlash'**
  String get save;

  /// No description provided for @cancel.
  ///
  /// In uz, this message translates to:
  /// **'Bekor qilish'**
  String get cancel;

  /// No description provided for @region.
  ///
  /// In uz, this message translates to:
  /// **'Viloyat'**
  String get region;

  /// No description provided for @city.
  ///
  /// In uz, this message translates to:
  /// **'Shahar/Tuman'**
  String get city;

  /// No description provided for @phoneLabel.
  ///
  /// In uz, this message translates to:
  /// **'Telefon raqamingiz'**
  String get phoneLabel;

  /// No description provided for @fullNameLabel.
  ///
  /// In uz, this message translates to:
  /// **'F.I.Sh.'**
  String get fullNameLabel;

  /// No description provided for @comment.
  ///
  /// In uz, this message translates to:
  /// **'Izoh'**
  String get comment;

  /// No description provided for @power.
  ///
  /// In uz, this message translates to:
  /// **'Quvvat'**
  String get power;

  /// No description provided for @continueBtn.
  ///
  /// In uz, this message translates to:
  /// **'Davom etish'**
  String get continueBtn;

  /// No description provided for @confirm.
  ///
  /// In uz, this message translates to:
  /// **'Tasdiqlash'**
  String get confirm;

  /// No description provided for @welcome.
  ///
  /// In uz, this message translates to:
  /// **'Xush kelibsiz'**
  String get welcome;

  /// No description provided for @noResults.
  ///
  /// In uz, this message translates to:
  /// **'Hech narsa topilmadi'**
  String get noResults;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['en', 'ru', 'uz'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'en':
      return AppLocalizationsEn();
    case 'ru':
      return AppLocalizationsRu();
    case 'uz':
      return AppLocalizationsUz();
  }

  throw FlutterError(
      'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
      'an issue with the localizations generation tool. Please file an issue '
      'on GitHub with a reproducible sample app and the gen-l10n configuration '
      'that was used.');
}
